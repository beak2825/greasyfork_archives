// ==UserScript==
// @name			HW_Adventure
// @name:en			HW_Adventure
// @name:ru			HW_Adventure
// @namespace		HW_Adventure
// @version			1.0.0.3
// @description		Automation of actions for the game Hero Wars
// @description:en	Automation of actions for the game Hero Wars
// @description:ru	Автоматизация действий для игры Хроники Хаоса
// @homepage		http://ilovemycomp.narod.ru/HeroWarsHelper.user.js
// @icon			http://ilovemycomp.narod.ru/VaultBoyIco16.ico
// @icon64			http://ilovemycomp.narod.ru/VaultBoyIco64.png
// @encoding		utf-8
// @include			https://apps-1701433570146040.apps.fbsbx.com/*
// @include			https://*.nextersglobal.com/*
// @include			https://*.hero-wars*.com/*
// @match			https://www.solfors.com/
// @match			https://t.me/s/hw_ru
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/492598/HW_Adventure.user.js
// @updateURL https://update.greasyfork.org/scripts/492598/HW_Adventure.meta.js
// ==/UserScript==

(function() {
/**
 * Start script
 *
 * Стартуем скрипт
 */
console.log('Start ' + GM_info.script.name + ', v' + GM_info.script.version);
/**
 * Script info
 *
 * Информация о скрипте
 */
const scriptInfo = (({name, version, author, homepage, lastModified}, updateUrl, source) =>
	({name, version, author, homepage, lastModified, updateUrl, source}))
	(GM_info.script, GM_info.scriptUpdateURL, arguments.callee.toString());
/**
 * If we are on the gifts page, then we collect and send them to the server
 *
 * Если находимся на странице подарков, то собираем и отправляем их на сервер
 */
if (['www.solfors.com', 't.me'].includes(location.host)) {
	setTimeout(sendCodes, 2000);
	return;
}
/**
 * Information for completing daily quests
 *
 * Информация для выполнения ежендевных квестов
 */
const questsInfo = {};
/**
 * Is the game data loaded
 *
 * Загружены ли данные игры
 */
let isLoadGame = false;
/**
 * Headers of the last request
 *
 * Заголовки последнего запроса
 */
let lastHeaders = {};
/**
 * Information about sent gifts
 *
 * Информация об отправленных подарках
 */
let freebieCheckInfo = null;
/** Пачки для тестов в чате*/ //тест сохранка
    let repleyBattle = {
        defenders: {},
        attackers: {},
        effects: {},
        state: {},
        seed: undefined
    }
/**
 * User data
 *
 * Данные пользователя
 */
let userInfo;
/**
 * Original methods for working with AJAX
 *
 * Оригинальные методы для работы с AJAX
 */
const original = {
	open: XMLHttpRequest.prototype.open,
	send: XMLHttpRequest.prototype.send,
	setRequestHeader: XMLHttpRequest.prototype.setRequestHeader,
};
/**
 * Decoder for converting byte data to JSON string
 *
 * Декодер для перобразования байтовых данных в JSON строку
 */
const decoder = new TextDecoder("utf-8");
/**
 * Stores a history of requests
 *
 * Хранит историю запросов
 */
let requestHistory = {};
/**
 * URL for API requests
 *
 * URL для запросов к API
 */
let apiUrl = '';

/**
 * Connecting to the game code
 *
 * Подключение к коду игры
 */
this.cheats = new hackGame();
/**
 * The function of calculating the results of the battle
 *
 * Функция расчета результатов боя
 */
this.BattleCalc = cheats.BattleCalc;
/**
 * Sending a request available through the console
 *
 * Отправка запроса доступная через консоль
 */
this.SendRequest = send;
/**
 * Simple combat calculation available through the console
 *
 * Простой расчет боя доступный через консоль
 */
this.Calc = function (data) {
	const type = getBattleType(data?.type);
	return new Promise((resolve, reject) => {
		try {
			BattleCalc(data, type, resolve);
		} catch (e) {
			reject(e);
		}
	})
}
//тест остановка подземки
let stopDung = false;
/**
 * Short asynchronous request
 * Usage example (returns information about a character):
 * const userInfo = await Send('{"calls":[{"name":"userGetInfo","args":{},"ident":"body"}]}')
 *
 * Короткий асинхронный запрос
 * Пример использования (возвращает информацию о персонаже):
 * const userInfo = await Send('{"calls":[{"name":"userGetInfo","args":{},"ident":"body"}]}')
*/
this.Send = function (json, pr) {
	return new Promise((resolve, reject) => {
		try {
			send(json, resolve, pr);
		} catch (e) {
			reject(e);
		}
	})
}

const i18nLangData = {
	/* English translation by BaBa */
	en: {
		/* Checkboxes */
		SKIP_FIGHTS: 'Skip battle',
		SKIP_FIGHTS_TITLE: 'Skip battle in Outland and the arena of the titans, auto-pass in the tower and campaign',
		ENDLESS_CARDS: 'Infinite cards',
		ENDLESS_CARDS_TITLE: 'Disable Divination Cards wasting',
		AUTO_EXPEDITION: 'Auto Expedition',
		AUTO_EXPEDITION_TITLE: 'Auto-sending expeditions',
		CANCEL_FIGHT: 'Cancel battle',
		CANCEL_FIGHT_TITLE: 'The possibility of canceling the battle on VG',
		GIFTS: 'Gifts',
		GIFTS_TITLE: 'Collect gifts automatically',
		BATTLE_RECALCULATION: 'Battle recalculation',
		BATTLE_RECALCULATION_TITLE: 'Preliminary calculation of the battle',
		BATTLE_FISHING: 'Finishing',
		BATTLE_FISHING_TITLE: 'Finishing off the team from the last replay in the chat',
		BATTLE_TRENING: 'Workout',
		BATTLE_TRENING_TITLE: 'A training battle in the chat against the team from the last replay',
		QUANTITY_CONTROL: 'Quantity control',
		QUANTITY_CONTROL_TITLE: 'Ability to specify the number of opened "lootboxes"',
		REPEAT_CAMPAIGN: 'Repeat missions',
		REPEAT_CAMPAIGN_TITLE: 'Auto-repeat battles in the campaign',
		DISABLE_DONAT: 'Disable donation',
		DISABLE_DONAT_TITLE: 'Removes all donation offers',
		DAILY_QUESTS: 'Quests',
		DAILY_QUESTS_TITLE: 'Complete daily quests',
		AUTO_QUIZ: 'AutoQuiz',
		AUTO_QUIZ_TITLE: 'Automatically receive correct answers to quiz questions',
		SECRET_WEALTH_CHECKBOX: 'Automatic purchase in the store "Secret Wealth" when entering the game',
		HIDE_SERVERS: 'Collapse servers',
		HIDE_SERVERS_TITLE: 'Hide unused servers',
		/* Input fields */
		HOW_MUCH_TITANITE: 'How much titanite to farm',
		COMBAT_SPEED: 'Combat Speed Multiplier',
		HOW_REPEAT_CAMPAIGN: 'how many mission replays', //тест добавил
		NUMBER_OF_TEST: 'Number of test fights',
		NUMBER_OF_AUTO_BATTLE: 'Number of auto-battle attempts',
		USER_ID_TITLE: 'Enter the player ID',
		AMOUNT: 'Gift number, 1 - hero development, 2 - pets, 3 - light, 4 - darkness, 5 - ascension, 6 - appearance',
		GIFT_NUM: 'Number of gifts to be sent',
		/* Buttons */
		RUN_SCRIPT: 'Run the',
		STOP_SCRIPT: 'Stop the',
		TO_DO_EVERYTHING: 'Do All',
		TO_DO_EVERYTHING_TITLE: 'Perform multiple actions of your choice',
		OUTLAND: 'Outland',
		OUTLAND_TITLE: 'Collect Outland',
		TITAN_ARENA: 'ToE',
		TITAN_ARENA_TITLE: 'Complete the titan arena',
		DUNGEON: 'Dungeon',
		DUNGEON_TITLE: 'Go through the dungeon',
		DUNGEON2: 'Dungeon full',
		DUNGEON_FULL_TITLE: 'Dungeon for Full Titans',
        STOP_DUNGEON: 'Stop Dungeon',
        STOP_DUNGEON_TITLE: 'Stop digging the dungeon',
		SEER: 'Seer',
		SEER_TITLE: 'Roll the Seer',
		TOWER: 'Tower',
		TOWER_TITLE: 'Pass the tower',
		EXPEDITIONS: 'Expeditions',
		EXPEDITIONS_TITLE: 'Sending and collecting expeditions',
		SYNC: 'Sync',
		SYNC_TITLE: 'Partial synchronization of game data without reloading the page',
		ARCHDEMON: 'Archdemon',
		CRUCIBLE_SOULS: 'Crucible',
		ARCHDEMON_TITLE: 'Hitting kills and collecting rewards',
		CRUCIBLE_SOULS_TITLE: 'Fill the kilos in the crucible of souls',
		ESTER_EGGS: 'Easter eggs',
		ESTER_EGGS_TITLE: 'Collect all Easter eggs or rewards',
		REWARDS: 'Rewards',
		REWARDS_TITLE: 'Collect all quest rewards',
		MAIL: 'Mail',
		MAIL_TITLE: 'Collect all mail, except letters with energy and charges of the portal',
		MINIONS: 'Minions',
		MINIONS_TITLE: 'Attack minions with saved packs',
		ADVENTURE: 'Adventure',
		ADVENTURE_TITLE: 'Passes the adventure along the specified route',
		STORM: 'Storm',
		STORM_TITLE: 'Passes the Storm along the specified route',
		SANCTUARY: 'Sanctuary',
		SANCTUARY_TITLE: 'Fast travel to Sanctuary',
		GUILD_WAR: 'Guild War',
		GUILD_WAR_TITLE: 'Fast travel to Guild War',
		SECRET_WEALTH: 'Secret Wealth',
		SECRET_WEALTH_TITLE: 'Buy something in the store "Secret Wealth"',
		/* Misc */
		BOTTOM_URLS: '<a href="https://t.me/+0oMwICyV1aQ1MDAy" target="_blank" title="Telegram"><svg style="margin: 2px;" width="20" height="20" viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="99.2583404%" id="linearGradient-1"><stop stop-color="#2AABEE" offset="0%"></stop><stop stop-color="#229ED9" offset="100%"></stop></linearGradient></defs><g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><circle id="Oval" fill="url(#linearGradient-1)" cx="500" cy="500" r="500"></circle><path d="M226.328419,494.722069 C372.088573,431.216685 469.284839,389.350049 517.917216,369.122161 C656.772535,311.36743 685.625481,301.334815 704.431427,301.003532 C708.567621,300.93067 717.815839,301.955743 723.806446,306.816707 C728.864797,310.92121 730.256552,316.46581 730.922551,320.357329 C731.588551,324.248848 732.417879,333.113828 731.758626,340.040666 C724.234007,419.102486 691.675104,610.964674 675.110982,699.515267 C668.10208,736.984342 654.301336,749.547532 640.940618,750.777006 C611.904684,753.448938 589.856115,731.588035 561.733393,713.153237 C517.726886,684.306416 492.866009,666.349181 450.150074,638.200013 C400.78442,605.66878 432.786119,587.789048 460.919462,558.568563 C468.282091,550.921423 596.21508,434.556479 598.691227,424.000355 C599.00091,422.680135 599.288312,417.758981 596.36474,415.160431 C593.441168,412.561881 589.126229,413.450484 586.012448,414.157198 C581.598758,415.158943 511.297793,461.625274 375.109553,553.556189 C355.154858,567.258623 337.080515,573.934908 320.886524,573.585046 C303.033948,573.199351 268.692754,563.490928 243.163606,555.192408 C211.851067,545.013936 186.964484,539.632504 189.131547,522.346309 C190.260287,513.342589 202.659244,504.134509 226.328419,494.722069 Z" id="Path-3" fill="#FFFFFF"></path></g></svg></a>',
		GIFTS_SENT: 'Gifts sent!',
		DO_YOU_WANT: "Do you really want to do this?",
		BTN_RUN: 'Run',
		BTN_CANCEL: 'Cancel',
		BTN_OK: 'OK',
		MSG_HAVE_BEEN_DEFEATED: 'You have been defeated!',
		BTN_AUTO: 'Auto',
		MSG_YOU_APPLIED: 'You applied',
		MSG_DAMAGE: 'damage',
		MSG_CANCEL_AND_STAT: 'Auto (F5) and show statistic',
		MSG_REPEAT_MISSION: 'Repeat the mission?',
		BTN_REPEAT: 'Repeat',
		BTN_NO: 'No',
		MSG_SPECIFY_QUANT: 'Specify Quantity:',
		BTN_OPEN: 'Open',
		QUESTION_COPY: 'Question copied to clipboard',
		ANSWER_KNOWN: 'The answer is known',
		ANSWER_NOT_KNOWN: 'ATTENTION THE ANSWER IS NOT KNOWN',
		BEING_RECALC: 'The battle is being recalculated',
		THIS_TIME: 'This time',
		//VICTORY: 'VICTORY',
		//DEFEAT: 'DEFEAT',
		//CHANCE_TO_WIN: "Chance to win",
		VICTORY: '<span style="color:green;">VICTORY</span>',
		DEFEAT: '<span style="color:red;">DEFEAT</span>',
		CHANCE_TO_WIN: 'Chance to win <span style="color: red;">based on pre-calculation</span>',
		OPEN_DOLLS: 'nesting dolls recursively',
		SENT_QUESTION: 'Question sent',
		SETTINGS: 'Settings',
		MSG_BAN_ATTENTION: '<p style="color:red;">Using this feature may result in a ban.</p> Continue?',
		BTN_YES_I_AGREE: 'Yes, I understand the risks!',
		BTN_NO_I_AM_AGAINST: 'No, I refuse it!',
		VALUES: 'Values',
		SAVING: 'Saving',
		USER_ID: 'User Id',
        SEND_GIFT: 'The gift has been sent',
		EXPEDITIONS_SENT: 'Expeditions sent',
		TITANIT: 'Titanit',
		COMPLETED: 'completed',
		FLOOR: 'Floor',
		LEVEL: 'Level',
		BATTLES: 'battles',
		EVENT: 'Event',
		NOT_AVAILABLE: 'not available',
		NO_HEROES: 'No heroes',
		DAMAGE_AMOUNT: 'Damage amount',
		NOTHING_TO_COLLECT: 'Nothing to collect',
		COLLECTED: 'Collected',
		REWARD: 'rewards',
		REMAINING_ATTEMPTS: 'Remaining attempts',
		BATTLES_CANCELED: 'Battles canceled',
		MINION_RAID: 'Minion Raid',
		STOPPED: 'Stopped',
		REPETITIONS: 'Repetitions',
		MISSIONS_PASSED: 'Missions passed',
		STOP: 'stop',
		TOTAL_OPEN: 'Total open',
		OPEN: 'Open',
		ROUND_STAT: 'Damage statistics for ',
		BATTLE: 'battles',
		MINIMUM: 'Minimum',
		MAXIMUM: 'Maximum',
		AVERAGE: 'Average',
		NOT_THIS_TIME: 'Not this time',
		RETRY_LIMIT_EXCEEDED: 'Retry limit exceeded',
		SUCCESS: 'Success',
		RECEIVED: 'Received',
		LETTERS: 'letters',
		PORTALS: 'portals',
		ATTEMPTS: 'attempts',
		/* Quests */
		QUEST_10001: 'Upgrade the skills of heroes 3 times',
		QUEST_10002: 'Complete 10 missions',
		QUEST_10003: 'Complete 3 heroic missions',
		QUEST_10004: 'Fight 3 times in the Arena or Grand Arena',
		QUEST_10006: 'Use the exchange of emeralds 1 time',
		QUEST_10007: 'Perform 1 summon in the Solu Atrium',
		QUEST_10016: 'Send gifts to guildmates',
		QUEST_10018: 'Use an experience potion',
		QUEST_10019: 'Open 1 chest in the Tower',
		QUEST_10020: 'Open 3 chests in Outland',
		QUEST_10021: 'Collect 75 Titanite in the Guild Dungeon',
		QUEST_10021: 'Collect 150 Titanite in the Guild Dungeon',
		QUEST_10023: 'Upgrade Gift of the Elements by 1 level',
		QUEST_10024: 'Level up any artifact once',
		QUEST_10025: 'Start Expedition 1',
		QUEST_10026: 'Start 4 Expeditions',
		QUEST_10027: 'Win 1 battle of the Tournament of Elements',
		QUEST_10028: 'Level up any titan artifact',
		QUEST_10029: 'Unlock the Orb of Titan Artifacts',
		QUEST_10030: 'Upgrade any Skin of any hero 1 time',
		QUEST_10031: 'Win 6 battles of the Tournament of Elements',
		QUEST_10043: 'Start or Join an Adventure',
		QUEST_10044: 'Use Summon Pets 1 time',
		QUEST_10046: 'Open 3 chests in Adventure',
		QUEST_10047: 'Get 150 Guild Activity Points',
		NOTHING_TO_DO: 'Nothing to do',
		YOU_CAN_COMPLETE: 'You can complete quests',
		BTN_DO_IT: 'Do it',
		NOT_QUEST_COMPLETED: 'Not a single quest completed',
		COMPLETED_QUESTS: 'Completed quests',
		/* everything button */
		ASSEMBLE_OUTLAND: 'Assemble Outland',
		PASS_THE_TOWER: 'Pass the tower',
		CHECK_EXPEDITIONS: 'Check Expeditions',
		COMPLETE_TOE: 'Complete ToE',
		COMPLETE_DUNGEON: 'Complete the dungeon',
        COMPLETE_DUNGEON_FULL: 'Complete the dungeon for Full Titans',
		COLLECT_MAIL: 'Collect mail',
		COLLECT_MISC: 'Collect some bullshit',
		COLLECT_MISC_TITLE: 'Collect Easter Eggs, Skin Gems, Keys, Arena Coins and Soul Crystal',
		COLLECT_QUEST_REWARDS: 'Collect quest rewards',
		MAKE_A_SYNC: 'Make a sync',

		RUN_FUNCTION: 'Run the following functions?',
		BTN_GO: 'Go!',
		PERFORMED: 'Performed',
		DONE: 'Done',
		ERRORS_OCCURRES: 'Errors occurred while executing',
		COPY_ERROR: 'Copy error information to clipboard',
		BTN_YES: 'Yes',
		ALL_TASK_COMPLETED: 'All tasks completed',

		UNKNOWN: 'unknown',
		ENTER_THE_PATH: 'Enter the path of adventure using commas or dashes',
		START_ADVENTURE: 'Start your adventure along this path!',
		INCORRECT_WAY: 'Incorrect path in adventure: {from} -> {to}',
		BTN_CANCELED: 'Canceled',
		MUST_TWO_POINTS: 'The path must contain at least 2 points.',
		MUST_ONLY_NUMBERS: 'The path must contain only numbers and commas',
		NOT_ON_AN_ADVENTURE: 'You are not on an adventure',
		YOU_IN_NOT_ON_THE_WAY: 'Your location is not on the way',
		ATTEMPTS_NOT_ENOUGH: 'Your attempts are not enough to complete the path, continue?',
		YES_CONTINUE: 'Yes, continue!',
		NOT_ENOUGH_AP: 'Not enough action points',
		ATTEMPTS_ARE_OVER: 'The attempts are over',
		MOVES: 'Moves',
		BUFF_GET_ERROR: 'Buff getting error',
		BATTLE_END_ERROR: 'Battle end error',
		AUTOBOT: 'Autobot',
		FAILED_TO_WIN_AUTO: 'Failed to win the auto battle',
		ERROR_OF_THE_BATTLE_COPY: 'An error occurred during the passage of the battle<br>Copy the error to the clipboard?',
		ERROR_DURING_THE_BATTLE: 'Error during the battle',
		NO_CHANCE_WIN: 'No chance of winning this fight: 0/',
		LOST_HEROES: 'You have won, but you have lost one or several heroes',
		VICTORY_IMPOSSIBLE: 'Is victory impossible, should we focus on the result?',
		FIND_COEFF: 'Find the coefficient greater than',
		BTN_PASS: 'PASS',
		BRAWLS: 'Brawls',
		BRAWLS_TITLE: 'Activates the ability to auto-brawl',
		START_AUTO_BRAWLS: 'Start Auto Brawls?',
		LOSSES: 'Losses',
		WINS: 'Wins',
		FIGHTS: 'Fights',
		STAGE: 'Stage',
		DONT_HAVE_LIVES: 'You don\'t have lives',
		LIVES: 'Lives',
        SECRET_WEALTH_ALREADY: 'Item for Pet Potions already purchased',
		SECRET_WEALTH_NOT_ENOUGH: 'Not Enough Pet Potion, You Have {available}, Need {need}',
		SECRET_WEALTH_UPGRADE_NEW_PET: 'After purchasing the Pet Potion, it will not be enough to upgrade a new pet',
		SECRET_WEALTH_PURCHASED: 'Purchased {count} {name}',
		SECRET_WEALTH_CANCELED: 'Secret Wealth: Purchase Canceled',
		SECRET_WEALTH_BUY: 'You have {available} Pet Potion.<br>Do you want to buy {countBuy} {name} for {price} Pet Potion?',
		DAILY_BONUS: 'Daily bonus',
		DO_DAILY_QUESTS: 'Do daily quests',
		ACTIONS: 'Actions',
		ACTIONS_TITLE: 'Dialog box with various actions',
		OTHERS: 'Others',
		OTHERS_TITLE: 'Others',
		CHOOSE_ACTION: 'Choose an action',
		OPEN_LOOTBOX: 'You have {lootBox} boxes, should we open them?',
		STAMINA: 'Energy',
		BOXES_OVER: 'The boxes are over',
		NO_BOXES: 'No boxes',
		NO_MORE_ACTIVITY: 'No more activity for items today',
		EXCHANGE_ITEMS: 'Exchange items for activity points (max {maxActive})?',
		GET_ACTIVITY: 'Get Activity',
		NOT_ENOUGH_ITEMS: 'Not enough items',
		ACTIVITY_RECEIVED: 'Activity received',
		NO_PURCHASABLE_HERO_SOULS: 'No purchasable Hero Souls',
		PURCHASED_HERO_SOULS: 'Purchased {countHeroSouls} Hero Souls',
		NOT_ENOUGH_EMERALDS_540: 'Not enough emeralds, you need 540 you have {currentStarMoney}',
		CHESTS_NOT_AVAILABLE: 'Chests not available',
		OUTLAND_CHESTS_RECEIVED: 'Outland chests received',
		RAID_NOT_AVAILABLE: 'The raid is not available or there are no spheres',
		RAID_ADVENTURE: 'Raid {adventureId} adventure!',
		SOMETHING_WENT_WRONG: 'Something went wrong',
		ADVENTURE_COMPLETED: 'Adventure {adventureId} completed {times} times',
		CLAN_STAT_COPY: 'Clan statistics copied to clipboard',
		GET_ENERGY: 'Get Energy',
		GET_ENERGY_TITLE: 'Opens platinum boxes one at a time until you get 250 energy',
		ITEM_EXCHANGE: 'Item Exchange',
		ITEM_EXCHANGE_TITLE: 'Exchanges items for the specified amount of activity',
		BUY_SOULS: 'Buy souls',
		BUY_SOULS_TITLE: 'Buy hero souls from all available shops',
		BUY_OUTLAND: 'Buy Outland',
		BUY_OUTLAND_TITLE: 'Buy 9 chests in Outland for 540 emeralds',
		AUTO_RAID_ADVENTURE: 'Raid adventure',
		AUTO_RAID_ADVENTURE_TITLE: 'Raid adventure set number of times',
		CLAN_STAT: 'Clan statistics',
		CLAN_STAT_TITLE: 'Copies clan statistics to the clipboard',
		BTN_AUTO_F5: 'Auto (F5)',
		BOSS_DAMAGE: 'Boss Damage: ',
		NOTHING_BUY: 'Nothing to buy',
		LOTS_BOUGHT: '{countBuy} lots bought for gold',
		BUY_FOR_GOLD: 'Buy for gold',
		BUY_FOR_GOLD_TITLE: 'Buy items for gold in the Town Shop and in the Pet Soul Stone Shop',
		REWARDS_AND_MAIL: 'Rewars and Mail',
		REWARDS_AND_MAIL_TITLE: 'Collects rewards and mail',
		New_Year_Clan: 'a gift for a friend',
		New_Year_Clan_TITLE: 'New Year gifts to friends',
		COLLECT_REWARDS_AND_MAIL: 'Collected {countQuests} rewards and {countMail} letters',
		TIMER_ALREADY: 'Timer already started',
		NO_ATTEMPTS_TIMER_START: 'No attempts, timer started',
		EPIC_BRAWL_RESULT: 'Wins: {wins}/{attempts}, Coins: {coins}, Streak: {progress}/{nextStage} [Close]{end}',
		ATTEMPT_ENDED: '<br>Attempts ended, timer started',
		EPIC_BRAWL: 'Cosmic Battle',
		EPIC_BRAWL_TITLE: 'Spends attempts in the Cosmic Battle',
		RELOAD_GAME: 'Reload game',
		TIMER: 'Timer:',
		SHOW_ERRORS: 'Show errors',
		SHOW_ERRORS_TITLE: 'Show server request errors',
		ERROR_MSG: 'Error: {name}<br>{description}',
		EVENT_AUTO_BOSS: 'Maximum number of battles for calculation:</br>{length} ∗ {countTestBattle} = {maxCalcBattle}</br>If you have a weak computer, it may take a long time for this, click on the cross to cancel.</br>Should I search for the best pack from all or the first suitable one?',
		BEST_SLOW: 'Best (slower)',
		FIRST_FAST: 'First (faster)',
		FREEZE_INTERFACE: 'Calculating... <br>The interface may freeze.',
		ERROR_F12: 'Error, details in the console (F12)',
		FAILED_FIND_WIN_PACK: 'Failed to find a winning pack',
		BEST_PACK: 'Best pack:',
		BOSS_HAS_BEEN_DEF: 'Boss {boosLvl} has been defeated.',
		//NOT_ENOUGH_ATTEMPTS_BOSS: 'Not enough attempts to defeat boss {boosLvl}, retry?',
		//BOSS_HAS_BEEN_DEF: 'Boss {bossLvl} has been defeated.',
		NOT_ENOUGH_ATTEMPTS_BOSS: 'Not enough attempts to defeat boss {bossLvl}, retry?',
		BOSS_VICTORY_IMPOSSIBLE: 'Based on the recalculation of {battles} battles, victory has not been achieved. Would you like to continue the search for a winning battle in real battles? <p style="color:red;">Using this feature may be considered as DDoS attack or HTTP flooding and result in permanent ban</p>',
		BOSS_HAS_BEEN_DEF_TEXT: 'Boss {bossLvl} defeated in<br>{countBattle}/{countMaxBattle} attempts<br>(Please synchronize or restart the game to update the data)',
		PLAYER_POS: 'Player positions:',
        NY_GIFTS: 'Gifts',
		NY_GIFTS_TITLE: 'Open all New Year\'s gifts',
		NY_NO_GIFTS: 'No gifts not received',
		NY_GIFTS_COLLECTED: '{count} gifts collected',
		CHANGE_MAP: 'Island map',
		CHANGE_MAP_TITLE: 'Change island map',
		SELECT_ISLAND_MAP: 'Select an island map:',
		FIRST_MAP: 'First map',
		SECOND_MAP: 'Second map',
		SECRET_WEALTH_SHOP: 'Secret Wealth {name}: ',
	},
	ru: {
		/* Чекбоксы */
		SKIP_FIGHTS: 'Пропуск боев',
		SKIP_FIGHTS_TITLE: 'Пропуск боев в запределье и арене титанов, автопропуск в башне и кампании',
		ENDLESS_CARDS: 'Бесконечные карты',
		ENDLESS_CARDS_TITLE: 'Отключить трату карт предсказаний',
		AUTO_EXPEDITION: 'АвтоЭкспедиции',
		AUTO_EXPEDITION_TITLE: 'Автоотправка экспедиций',
		CANCEL_FIGHT: 'Отмена боя',
		CANCEL_FIGHT_TITLE: 'Возможность отмены боя на ВГ, СМ и в Асгарде',
		GIFTS: 'Подарки',
		GIFTS_TITLE: 'Собирать подарки автоматически',
		BATTLE_RECALCULATION: 'Прерасчет боя',
		BATTLE_RECALCULATION_TITLE: 'Предварительный расчет боя',
		BATTLE_FISHING: 'Добивание',
		BATTLE_FISHING_TITLE: 'Добивание в чате команды из последнего реплея',
		BATTLE_TRENING: 'Тренировка',
		BATTLE_TRENING_TITLE: 'Тренировочный бой в чате против команды из последнего реплея',
		QUANTITY_CONTROL: 'Контроль кол-ва',
		QUANTITY_CONTROL_TITLE: 'Возможность указывать количество открываемых "лутбоксов"',
		REPEAT_CAMPAIGN: 'Повтор в компании',
		REPEAT_CAMPAIGN_TITLE: 'Автоповтор боев в кампании',
		DISABLE_DONAT: 'Отключить донат',
		DISABLE_DONAT_TITLE: 'Убирает все предложения доната',
		DAILY_QUESTS: 'Квесты',
		DAILY_QUESTS_TITLE: 'Выполнять ежедневные квесты',
		AUTO_QUIZ: 'АвтоВикторина',
		AUTO_QUIZ_TITLE: 'Автоматическое получение правильных ответов на вопросы викторины',
		SECRET_WEALTH_CHECKBOX: 'Автоматическая покупка в магазине "Тайное Богатство" при заходе в игру',
		HIDE_SERVERS: 'Свернуть сервера',
		HIDE_SERVERS_TITLE: 'Скрывать неиспользуемые сервера',
		/* Поля ввода */
		HOW_MUCH_TITANITE: 'Сколько фармим титанита',
		COMBAT_SPEED: 'Множитель ускорения боя',
		HOW_REPEAT_CAMPAIGN: 'Сколько повторов миссий', //тест добавил
		NUMBER_OF_TEST: 'Количество тестовых боев',
		NUMBER_OF_AUTO_BATTLE: 'Количество попыток автобоев',
		USER_ID_TITLE: 'Введите айди игрока',
		AMOUNT: 'Количество отправляемых подарков',
		GIFT_NUM: 'Номер подарка, 1 - развитие героев, 2 - питомцы, 3 - света, 4 - тьмы, 5 - вознесения, 6 - облик',
		/* Кнопки */
		RUN_SCRIPT: 'Запустить скрипт',
		STOP_SCRIPT: 'Остановить скрипт',
		TO_DO_EVERYTHING: 'Сделать все',
		TO_DO_EVERYTHING_TITLE: 'Выполнить несколько действий',
		OUTLAND: 'Запределье',
		OUTLAND_TITLE: 'Собрать Запределье',
		TITAN_ARENA: 'Турнир Стихий',
		TITAN_ARENA_TITLE: 'Автопрохождение Турнира Стихий',
		DUNGEON: 'Подземелье',
		DUNGEON_TITLE: 'Автопрохождение подземелья',
		DUNGEON2: 'Подземелье фулл',
		DUNGEON_FULL_TITLE: 'Подземелье для фуловых титанов',
        STOP_DUNGEON: 'Стоп подземка',
        STOP_DUNGEON_TITLE: 'Остановить копание подземелья',
		SEER: 'Провидец',
		SEER_TITLE: 'Покрутить Провидца',
		TOWER: 'Башня',
		TOWER_TITLE: 'Автопрохождение башни',
		EXPEDITIONS: 'Экспедиции',
		EXPEDITIONS_TITLE: 'Отправка и сбор экспедиций',
		SYNC: 'Синхронизация',
		SYNC_TITLE: 'Частичная синхронизация данных игры без перезагрузки страницы',
		ARCHDEMON: 'Архидемон',
		CRUCIBLE_SOULS: 'Горнило душ',
		ARCHDEMON_TITLE: 'Набивает килы и собирает награду',
		CRUCIBLE_SOULS_TITLE:'Набить килов в горниле душ',
		ESTER_EGGS: 'Пасхалки',
		ESTER_EGGS_TITLE: 'Собрать все пасхалки или награды',
		REWARDS: 'Награды',
		REWARDS_TITLE: 'Собрать все награды за задания',
		MAIL: 'Почта',
		MAIL_TITLE: 'Собрать всю почту, кроме писем с энергией и зарядами портала',
		MINIONS: 'Прислужники',
		MINIONS_TITLE: 'Атакует прислужников сохраннеными пачками',
		ADVENTURE: 'Приключение',
		ADVENTURE_TITLE: 'Проходит приключение по указанному маршруту',
		STORM: 'Буря',
		STORM_TITLE: 'Проходит бурю по указанному маршруту',
		SANCTUARY: 'Святилище',
		SANCTUARY_TITLE: 'Быстрый переход к Святилищу',
		GUILD_WAR: 'Война гильдий',
		GUILD_WAR_TITLE: 'Быстрый переход к Войне гильдий',
		SECRET_WEALTH: 'Тайное богатство',
		SECRET_WEALTH_TITLE: 'Купить что-то в магазине "Тайное богатство"',
		/* Разное */
		BOTTOM_URLS: '<a href="https://t.me/+q6gAGCRpwyFkNTYy" target="_blank" title="Telegram"><svg style="margin: 2px;" width="20" height="20" viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="99.2583404%" id="linearGradient-1"><stop stop-color="#2AABEE" offset="0%"></stop><stop stop-color="#229ED9" offset="100%"></stop></linearGradient></defs><g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><circle id="Oval" fill="url(#linearGradient-1)" cx="500" cy="500" r="500"></circle><path d="M226.328419,494.722069 C372.088573,431.216685 469.284839,389.350049 517.917216,369.122161 C656.772535,311.36743 685.625481,301.334815 704.431427,301.003532 C708.567621,300.93067 717.815839,301.955743 723.806446,306.816707 C728.864797,310.92121 730.256552,316.46581 730.922551,320.357329 C731.588551,324.248848 732.417879,333.113828 731.758626,340.040666 C724.234007,419.102486 691.675104,610.964674 675.110982,699.515267 C668.10208,736.984342 654.301336,749.547532 640.940618,750.777006 C611.904684,753.448938 589.856115,731.588035 561.733393,713.153237 C517.726886,684.306416 492.866009,666.349181 450.150074,638.200013 C400.78442,605.66878 432.786119,587.789048 460.919462,558.568563 C468.282091,550.921423 596.21508,434.556479 598.691227,424.000355 C599.00091,422.680135 599.288312,417.758981 596.36474,415.160431 C593.441168,412.561881 589.126229,413.450484 586.012448,414.157198 C581.598758,415.158943 511.297793,461.625274 375.109553,553.556189 C355.154858,567.258623 337.080515,573.934908 320.886524,573.585046 C303.033948,573.199351 268.692754,563.490928 243.163606,555.192408 C211.851067,545.013936 186.964484,539.632504 189.131547,522.346309 C190.260287,513.342589 202.659244,504.134509 226.328419,494.722069 Z" id="Path-3" fill="#FFFFFF"></path></g></svg></a><a href="https://vk.com/invite/YNPxKGX" target="_blank" title="Вконтакте"><svg style="margin: 2px;" width="20" height="20" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2_40)"><path d="M0.5 48C0.5 25.3726 0.5 14.0589 7.52944 7.02944C14.5589 0 25.8726 0 48.5 0H52.5C75.1274 0 86.4411 0 93.4706 7.02944C100.5 14.0589 100.5 25.3726 100.5 48V52C100.5 74.6274 100.5 85.9411 93.4706 92.9706C86.4411 100 75.1274 100 52.5 100H48.5C25.8726 100 14.5589 100 7.52944 92.9706C0.5 85.9411 0.5 74.6274 0.5 52V48Z" fill="#0077FF"/><path d="M53.7085 72.042C30.9168 72.042 17.9169 56.417 17.3752 30.417H28.7919C29.1669 49.5003 37.5834 57.5836 44.25 59.2503V30.417H55.0004V46.8752C61.5837 46.1669 68.4995 38.667 70.8329 30.417H81.5832C79.7915 40.5837 72.2915 48.0836 66.9582 51.1669C72.2915 53.6669 80.8336 60.2086 84.0836 72.042H72.2499C69.7082 64.1253 63.3754 58.0003 55.0004 57.1669V72.042H53.7085Z" fill="white"/></g><defs><clipPath id="clip0_2_40"><rect width="100" height="100" fill="white" transform="translate(0.5)"/></clipPath></defs></svg></a>',
		GIFTS_SENT: 'Подарки отправлены!',
		DO_YOU_WANT: "Вы действительно хотите это сделать?",
		BTN_RUN: 'Запускай',
		BTN_CANCEL: 'Отмена',
		BTN_OK: 'Ок',
		MSG_HAVE_BEEN_DEFEATED: 'Вы потерпели поражение!',
		BTN_AUTO: 'Авто',
		MSG_YOU_APPLIED: 'Вы нанесли',
		MSG_DAMAGE: 'урона',
		MSG_CANCEL_AND_STAT: 'Авто (F5) и показать Статистику',
		MSG_REPEAT_MISSION: 'Повторить миссию?',
		BTN_REPEAT: 'Повторить',
		BTN_NO: 'Нет',
		MSG_SPECIFY_QUANT: 'Указать количество:',
		BTN_OPEN: 'Открыть',
		QUESTION_COPY: 'Вопрос скопирован в буфер обмена',
		ANSWER_KNOWN: 'Ответ известен',
		ANSWER_NOT_KNOWN: 'ВНИМАНИЕ ОТВЕТ НЕ ИЗВЕСТЕН',
		BEING_RECALC: 'Идет прерасчет боя',
		THIS_TIME: 'На этот раз',
		//VICTORY: 'ПОБЕДА',
		//DEFEAT: 'ПОРАЖЕНИЕ',
		//CHANCE_TO_WIN: 'Шансы на победу',
		VICTORY: '<span style="color:green;">ПОБЕДА</span>',
		DEFEAT: '<span style="color:red;">ПОРАЖЕНИЕ</span>',
		CHANCE_TO_WIN: 'Шансы на победу <span style="color:red;">на основе прерасчета</span>',
		OPEN_DOLLS: 'матрешек рекурсивно',
		SENT_QUESTION: 'Вопрос отправлен',
		SETTINGS: 'Настройки',
		MSG_BAN_ATTENTION: '<p style="color:red;">Использование этой функции может привести к бану.</p> Продолжить?',
		BTN_YES_I_AGREE: 'Да, я беру на себя все риски!',
		BTN_NO_I_AM_AGAINST: 'Нет, я отказываюсь от этого!',
		VALUES: 'Значения',
		SAVING: 'Сохранка',
		USER_ID: 'айди пользователя',
        SEND_GIFT: 'Подарок отправлен',
		EXPEDITIONS_SENT: 'Экспедиции отправлены',
		TITANIT: 'Титанит',
		COMPLETED: 'завершено',
		FLOOR: 'Этаж',
		LEVEL: 'Уровень',
		BATTLES: 'бои',
		EVENT: 'Эвент',
		NOT_AVAILABLE: 'недоступен',
		NO_HEROES: 'Нет героев',
		DAMAGE_AMOUNT: 'Количество урона',
		NOTHING_TO_COLLECT: 'Нечего собирать',
		COLLECTED: 'Собрано',
		REWARD: 'наград',
		REMAINING_ATTEMPTS: 'Осталось попыток',
		BATTLES_CANCELED: 'Битв отменено',
		MINION_RAID: 'Рейд прислужников',
		STOPPED: 'Остановлено',
		REPETITIONS: 'Повторений',
		MISSIONS_PASSED: 'Миссий пройдено',
		STOP: 'остановить',
		TOTAL_OPEN: 'Всего открыто',
		OPEN: 'Открыто',
		ROUND_STAT: 'Статистика урона за',
		BATTLE: 'боев',
		MINIMUM: 'Минимальный',
		MAXIMUM: 'Максимальный',
		AVERAGE: 'Средний',
		NOT_THIS_TIME: 'Не в этот раз',
		RETRY_LIMIT_EXCEEDED: 'Превышен лимит попыток',
		SUCCESS: 'Успех',
		RECEIVED: 'Получено',
		LETTERS: 'писем',
		PORTALS: 'порталов',
		ATTEMPTS: 'попыток',
		QUEST_10001: 'Улучши умения героев 3 раза',
		QUEST_10002: 'Пройди 10 миссий',
		QUEST_10003: 'Пройди 3 героические миссии',
		QUEST_10004: 'Сразись 3 раза на Арене или Гранд Арене',
		QUEST_10006: 'Используй обмен изумрудов 1 раз',
		QUEST_10007: 'Соверши 1 призыв в Атриуме Душ',
		QUEST_10016: 'Отправь подарки согильдийцам',
		QUEST_10018: 'Используй зелье опыта',
		QUEST_10019: 'Открой 1 сундук в Башне',
		QUEST_10020: 'Открой 3 сундука в Запределье',
		QUEST_10021: 'Собери 75 Титанита в Подземелье Гильдии',
		QUEST_10021: 'Собери 150 Титанита в Подземелье Гильдии',
		QUEST_10023: 'Прокачай Дар Стихий на 1 уровень',
		QUEST_10024: 'Повысь уровень любого артефакта один раз',
		QUEST_10025: 'Начни 1 Экспедицию',
		QUEST_10026: 'Начни 4 Экспедиции',
		QUEST_10027: 'Победи в 1 бою Турнира Стихий',
		QUEST_10028: 'Повысь уровень любого артефакта титанов',
		QUEST_10029: 'Открой сферу артефактов титанов',
		QUEST_10030: 'Улучши облик любого героя 1 раз',
		QUEST_10031: 'Победи в 6 боях Турнира Стихий',
		QUEST_10043: 'Начни или присоединись к Приключению',
		QUEST_10044: 'Воспользуйся призывом питомцев 1 раз',
		QUEST_10046: 'Открой 3 сундука в Приключениях',
		QUEST_10047: 'Набери 150 очков активности в Гильдии',
		NOTHING_TO_DO: 'Нечего выполнять',
		YOU_CAN_COMPLETE: 'Можно выполнить квесты',
		BTN_DO_IT: 'Выполняй',
		NOT_QUEST_COMPLETED: 'Ни одного квеста не выполнено',
		COMPLETED_QUESTS: 'Выполнено квестов',
		/* everything button */
		ASSEMBLE_OUTLAND: 'Собрать Запределье',
		PASS_THE_TOWER: 'Пройти башню',
		CHECK_EXPEDITIONS: 'Проверить экспедиции',
		COMPLETE_TOE: 'Пройти Турнир Стихий',
		COMPLETE_DUNGEON: 'Пройти подземелье',
        COMPLETE_DUNGEON_FULL: 'Пройти подземелье фулл',
		COLLECT_MAIL: 'Собрать почту',
		COLLECT_MISC: 'Собрать всякую херню',
		COLLECT_MISC_TITLE: 'Собрать пасхалки, камни облика, ключи, монеты арены и Хрусталь души',
		COLLECT_QUEST_REWARDS: 'Собрать награды за квесты',
		MAKE_A_SYNC: 'Сделать синхронизацию',

		RUN_FUNCTION: 'Выполнить следующие функции?',
		BTN_GO: 'Погнали!',
		PERFORMED: 'Выполняется',
		DONE: 'Выполнено',
		ERRORS_OCCURRES: 'Призошли ошибки при выполнении',
		COPY_ERROR: 'Скопировать в буфер информацию об ошибке',
		BTN_YES: 'Да',
		ALL_TASK_COMPLETED: 'Все задачи выполнены',

		UNKNOWN: 'Неизвестно',
		ENTER_THE_PATH: 'Введите путь приключения через запятые или дефисы',
		START_ADVENTURE: 'Начать приключение по этому пути!',
		INCORRECT_WAY: 'Неверный путь в приключении: {from} -> {to}',
		BTN_CANCELED: 'Отменено',
		MUST_TWO_POINTS: 'Путь должен состоять минимум из 2х точек',
		MUST_ONLY_NUMBERS: 'Путь должен содержать только цифры и запятые',
		NOT_ON_AN_ADVENTURE: 'Вы не в приключении',
		YOU_IN_NOT_ON_THE_WAY: 'Указанный путь должен включать точку вашего положения',
		ATTEMPTS_NOT_ENOUGH: 'Ваших попыток не достаточно для завершения пути, продолжить?',
		YES_CONTINUE: 'Да, продолжай!',
		NOT_ENOUGH_AP: 'Попыток не достаточно',
		ATTEMPTS_ARE_OVER: 'Попытки закончились',
		MOVES: 'Ходы',
		BUFF_GET_ERROR: 'Ошибка при получении бафа',
		BATTLE_END_ERROR: 'Ошибка завершения боя',
		AUTOBOT: 'АвтоБой',
		FAILED_TO_WIN_AUTO: 'Не удалось победить в автобою',
		ERROR_OF_THE_BATTLE_COPY: 'Призошли ошибка в процессе прохождения боя<br>Скопировать ошибку в буфер обмена?',
		ERROR_DURING_THE_BATTLE: 'Ошибка в процессе прохождения боя',
		NO_CHANCE_WIN: 'Нет шансов победить в этом бою: 0/',
		LOST_HEROES: 'Вы победили, но потеряли одного или несколько героев!',
		VICTORY_IMPOSSIBLE: 'Победа не возможна, бъем на результат?',
		FIND_COEFF: 'Поиск коэффициента больше чем',
		BTN_PASS: 'ПРОПУСК',
		BRAWLS: 'Потасовки',
		BRAWLS_TITLE: 'Включает возможность автопотасовок',
		START_AUTO_BRAWLS: 'Запустить Автопотасовки?',
		LOSSES: 'Поражений',
		WINS: 'Побед',
		FIGHTS: 'Боев',
		STAGE: 'Стадия',
		DONT_HAVE_LIVES: 'У Вас нет жизней',
		LIVES: 'Жизни',
        SECRET_WEALTH_ALREADY: 'товар за Зелья питомцев уже куплен',
		SECRET_WEALTH_NOT_ENOUGH: 'Не достаточно Зелье Питомца, у Вас {available}, нужно {need}',
		SECRET_WEALTH_UPGRADE_NEW_PET: 'После покупки Зелье Питомца будет не достаточно для прокачки нового питомца',
		SECRET_WEALTH_PURCHASED: 'Куплено {count} {name}',
		SECRET_WEALTH_CANCELED: 'Тайное богатство: покупка отменена',
		SECRET_WEALTH_BUY: 'У вас {available} Зелье Питомца.<br>Вы хотите купить {countBuy} {name} за {price} Зелье Питомца?',
		DAILY_BONUS: 'Ежедневная награда',
		DO_DAILY_QUESTS: 'Сделать ежедневные квесты',
		ACTIONS: 'Действия',
		ACTIONS_TITLE: 'Диалоговое окно с различными действиями',
		OTHERS: 'Разное',
		OTHERS_TITLE: 'Диалоговое окно с дополнительными различными действиями',
		CHOOSE_ACTION: 'Выберите действие',
		OPEN_LOOTBOX: 'У Вас {lootBox} ящиков, открываем?',
		STAMINA: 'Энергия',
		BOXES_OVER: 'Ящики закончились',
		NO_BOXES: 'Нет ящиков',
		NO_MORE_ACTIVITY: 'Больше активности за предметы сегодня не получить',
		EXCHANGE_ITEMS: 'Обменять предметы на очки активности (не более {maxActive})?',
		GET_ACTIVITY: 'Получить активность',
		NOT_ENOUGH_ITEMS: 'Предметов недостаточно',
		ACTIVITY_RECEIVED: 'Получено активности',
		NO_PURCHASABLE_HERO_SOULS: 'Нет доступных для покупки душ героев',
		PURCHASED_HERO_SOULS: 'Куплено {countHeroSouls} душ героев',
		NOT_ENOUGH_EMERALDS_540: 'Недостаточно изюма, нужно 540 у Вас {currentStarMoney}',
		CHESTS_NOT_AVAILABLE: 'Сундуки не доступны',
		OUTLAND_CHESTS_RECEIVED: 'Получено сундуков Запределья',
		RAID_NOT_AVAILABLE: 'Рейд не доступен или сфер нет',
		RAID_ADVENTURE: 'Рейд {adventureId} приключения!',
		SOMETHING_WENT_WRONG: 'Что-то пошло не так',
		ADVENTURE_COMPLETED: 'Приключение {adventureId} пройдено {times} раз',
		CLAN_STAT_COPY: 'Клановая статистика скопирована в буфер обмена',
		GET_ENERGY: 'Получить энергию',
		GET_ENERGY_TITLE: 'Открывает платиновые шкатулки по одной до получения 250 энергии',
		ITEM_EXCHANGE: 'Обмен предметов',
		ITEM_EXCHANGE_TITLE: 'Обменивает предметы на указанное количество активности',
		BUY_SOULS: 'Купить души',
		BUY_SOULS_TITLE: 'Купить души героев из всех доступных магазинов',
		BUY_OUTLAND: 'Купить Запределье',
		BUY_OUTLAND_TITLE: 'Купить 9 сундуков в Запределье за 540 изумрудов',
		AUTO_RAID_ADVENTURE: 'Рейд приключения',
		AUTO_RAID_ADVENTURE_TITLE: 'Рейд приключения заданное количество раз',
		CLAN_STAT: 'Клановая статистика',
		CLAN_STAT_TITLE: 'Копирует клановую статистику в буфер обмена',
		BTN_AUTO_F5: 'Авто (F5)',
		BOSS_DAMAGE: 'Урон по боссу: ',
		NOTHING_BUY: 'Нечего покупать',
		LOTS_BOUGHT: 'За золото куплено {countBuy} лотов',
		BUY_FOR_GOLD: 'Скупить за золото',
		BUY_FOR_GOLD_TITLE: 'Скупить предметы за золото в Городской лавке и в магазине Камней Душ Питомцев',
		REWARDS_AND_MAIL: 'Награды и почта',
		REWARDS_AND_MAIL_TITLE: 'Собирает награды и почту',
		New_Year_Clan: 'подарок другу',
		New_Year_Clan_TITLE: 'Новогодние подарки друзьям',
		COLLECT_REWARDS_AND_MAIL: 'Собрано {countQuests} наград и {countMail} писем',
		TIMER_ALREADY: 'Таймер уже запущен',
		NO_ATTEMPTS_TIMER_START: 'Попыток нет, запущен таймер',
		EPIC_BRAWL_RESULT: '{i} Победы: {wins}/{attempts}, Монеты: {coins}, Серия: {progress}/{nextStage} [Закрыть]{end}',
		ATTEMPT_ENDED: '<br>Попытки закончились, запущен таймер',
		EPIC_BRAWL: 'Вселенская битва',
		EPIC_BRAWL_TITLE: 'Тратит попытки во Вселенской битве',
		RELOAD_GAME: 'Перезагрузить игру',
		TIMER: 'Таймер:',
		SHOW_ERRORS: 'Отображать ошибки',
		SHOW_ERRORS_TITLE: 'Отображать ошибки запросов к серверу',
		ERROR_MSG: 'Ошибка: {name}<br>{description}',
		EVENT_AUTO_BOSS: 'Максимальное количество боев для расчета:</br>{length} * {countTestBattle} = {maxCalcBattle}</br>Если у Вас слабый компьютер на это может потребоваться много времени, нажмите крестик для отмены.</br>Искать лучший пак из всех или первый подходящий?',
		BEST_SLOW: 'Лучший (медленее)',
		FIRST_FAST: 'Первый (быстрее)',
		FREEZE_INTERFACE: 'Идет расчет... <br> Интерфейс может зависнуть.',
		ERROR_F12: 'Ошибка, подробности в консоли (F12)',
		FAILED_FIND_WIN_PACK: 'Победный пак найти не удалось',
		BEST_PACK: 'Наилучший пак: ',
		//BOSS_HAS_BEEN_DEF: 'Босс {boosLvl} побежден',
		//NOT_ENOUGH_ATTEMPTS_BOSS: 'Для победы босса ${boosLvl} не хватило попыток, повторить?',
		BOSS_HAS_BEEN_DEF: 'Босс {bossLvl} побежден',
		NOT_ENOUGH_ATTEMPTS_BOSS: 'Для победы босса ${bossLvl} не хватило попыток, повторить?',
		BOSS_VICTORY_IMPOSSIBLE: 'По результатам прерасчета {battles} боев победу получить не удалось. Вы хотите продолжить поиск победного боя на реальных боях? <p style="color:red;">Использование этой функции может быть расценено как DDoS атака или HTTP-флуд и привести к перманентному бану</p>',
		BOSS_HAS_BEEN_DEF_TEXT: 'Босс {bossLvl} побежден за<br>{countBattle}/{countMaxBattle} попыток<br>(Сделайте синхронизацию или перезагрузите игру для обновления данных)',
		PLAYER_POS: 'Позиции игроков:',
        NY_GIFTS: 'Новогодние подарки',
		NY_GIFTS_TITLE: 'Открыть все новогодние подарки',
		NY_NO_GIFTS: 'Нет не полученных подарков',
		NY_GIFTS_COLLECTED: 'Собрано {count} подарков',
		CHANGE_MAP: 'Карта острова',
		CHANGE_MAP_TITLE: 'Сменить карту острова',
		SELECT_ISLAND_MAP: 'Выберите карту острова:',
		FIRST_MAP: 'Первая карта',
		SECOND_MAP: 'Вторая карта',
		SECRET_WEALTH_SHOP: 'Тайное богатство {name}: ',
	}
}

function getLang() {
	let lang = '';
	if (typeof NXFlashVars !== 'undefined') {
		lang = NXFlashVars.interface_lang
	}
	if (!lang) {
		lang = (navigator.language || navigator.userLanguage).substr(0, 2);
	}
	if (lang == 'ru') {
		return lang;
	}
	return 'en';
}

this.I18N = function (constant, replace) {
	const selectLang = getLang();
	if (constant && constant in i18nLangData[selectLang]) {
		const result = i18nLangData[selectLang][constant];
		if (replace) {
			return result.sprintf(replace);
		}
		return result;
	}
	return `% ${constant} %`;
};

String.prototype.sprintf = String.prototype.sprintf ||
	function () {
		"use strict";
		var str = this.toString();
		if (arguments.length) {
			var t = typeof arguments[0];
			var key;
			var args = ("string" === t || "number" === t) ?
				Array.prototype.slice.call(arguments)
				: arguments[0];

			for (key in args) {
				str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
			}
		}

		return str;
	};

/**
 * Checkboxes
 *
 * Чекбоксы
 */
const checkboxes = {
	passBattle: {
		label: I18N('SKIP_FIGHTS'),
		cbox: null,
		title: I18N('SKIP_FIGHTS_TITLE'),
		default: false
	},
	/*endlessCards: {
		label: I18N('ENDLESS_CARDS'),
		cbox: null,
		title: I18N('ENDLESS_CARDS_TITLE'),
		default: true
	},*/
	/*sendExpedition: {
		label: I18N('AUTO_EXPEDITION'),
		cbox: null,
		title: I18N('AUTO_EXPEDITION_TITLE'),
		default: true
	},*/
	cancelBattle: {
		label: I18N('CANCEL_FIGHT'),
		cbox: null,
		title: I18N('CANCEL_FIGHT_TITLE'),
		default: false,
	},
	preCalcBattle: {
		label: I18N('BATTLE_RECALCULATION'),
		cbox: null,
		title: I18N('BATTLE_RECALCULATION_TITLE'),
		default: false
	},
	finishingBattle: {
		label: I18N('BATTLE_FISHING'),
		cbox: null,
		title: I18N('BATTLE_FISHING_TITLE'),
		default: false
	},
	treningBattle: {
		label: I18N('BATTLE_TRENING'),
		cbox: null,
		title: I18N('BATTLE_TRENING_TITLE'),
		default: false
	},
	countControl: {
		label: I18N('QUANTITY_CONTROL'),
		cbox: null,
		title: I18N('QUANTITY_CONTROL_TITLE'),
		default: true
	},
	isRepeatMission: {
		label: I18N('REPEAT_CAMPAIGN'),
		cbox: null,
		title: I18N('REPEAT_CAMPAIGN_TITLE'),
		default: false
	},
	noOfferDonat: {
		label: I18N('DISABLE_DONAT'),
		cbox: null,
		title: I18N('DISABLE_DONAT_TITLE'),
		/**
		 * A crutch to get the field before getting the character id
		 *
		 * Костыль чтоб получать поле до получения id персонажа
		 */
		default: (() => {
			$result = false;
			try {
				$result = JSON.parse(localStorage[GM_info.script.name + ':noOfferDonat'])
			} catch(e) {
				$result = false;
			}
			return $result || false;
		})(),
	},
	dailyQuests: {
		label: I18N('DAILY_QUESTS'),
		cbox: null,
		title: I18N('DAILY_QUESTS_TITLE'),
		default: false
	},
	secretWealth: {
		label: I18N('SECRET_WEALTH'),
		cbox: null,
		title: I18N('SECRET_WEALTH_CHECKBOX'),
		default: false
	},
	// Потасовки
	/*
	autoBrawls: {
		label: I18N('BRAWLS'),
		cbox: null,
		title: I18N('BRAWLS_TITLE'),
		default: (() => {
			$result = false;
			try {
				$result = JSON.parse(localStorage[GM_info.script.name + ':autoBrawls'])
			} catch (e) {
				$result = false;
			}
			return $result || false;
		})(),
	},*/
	/*
	getAnswer: {
		label: I18N('AUTO_QUIZ'),
		cbox: null,
		title: I18N('AUTO_QUIZ_TITLE'),
		default: false
	},
	*/
	/*showErrors: {
		label: I18N('SHOW_ERRORS'),
		cbox: null,
		title: I18N('SHOW_ERRORS_TITLE'),
		default: true
	},*/
	buyForGold: {
		label: I18N('BUY_FOR_GOLD'),
		cbox: null,
		title: I18N('BUY_FOR_GOLD_TITLE'),
		default: false
	},
	hideServers: {
		label: I18N('HIDE_SERVERS'),
		cbox: null,
		title: I18N('HIDE_SERVERS_TITLE'),
		default: false
	},
};
/**
 * Get checkbox state
 *
 * Получить состояние чекбокса
 */
function isChecked(checkBox) {
	if (!(checkBox in checkboxes)) {
		return false;
	}
	return checkboxes[checkBox].cbox?.checked;
}
/**
 * Input fields
 *
 * Поля ввода
 */
const inputs = {
	countTitanit: {
		input: null,
		title: I18N('HOW_MUCH_TITANITE'),
		default: 150,
	},
	speedBattle: {
		input: null,
		title: I18N('COMBAT_SPEED'),
		default: 5,
	},
	//тест
    countRaid: {
        input: null,
        title: I18N('HOW_REPEAT_CAMPAIGN'),
        default: 5,
    },
	countTestBattle: {
		input: null,
		title: I18N('NUMBER_OF_TEST'),
		default: 10,
	},
	countAutoBattle: {
		input: null,
		title: I18N('NUMBER_OF_AUTO_BATTLE'),
		default: 10,
	}
}
//сохранка тест
const inputs2 = {
	countBattle: {
        input: null,
        title: '-1 сохраняет защиту, -2 атаку противника с Replay',
        default: 1,
	},
	needResource: {
			input: null,
			title: 'Мощь противника мин.(тыс.)/урона(млн.)',
			default: 300,
		},
	needResource2: {
			input: null,
			title: 'Мощь противника макс./тип бафа',
			default: 1500,
		},
}
//новогодние подарки игрокам других гильдий
const inputs3 = {
	userID: { // айди игрока посмотреть открыв его инфо
		input: null,
		title: I18N('USER_ID_TITLE'),
		default: 111111,
	},
	GiftNum: { // номер подарка считаем слева направо от 1 до 6, под 1 это за 750 новогодних игрушек
		input: null,
		title: I18N('GIFT_NUM'),
		default: 10,
	},
    AmontID: { // количество ресурсов от 1 до бесконечности
		input: null,
		title: I18N('AMOUNT'),
		default: 1,
	},
}
/**
 * Checks the checkbox
 *
 * Получить данные поля ввода
 */
/*function getInput(inputName) {
	return inputs[inputName].input.value;
}*/
function getInput(inputName) {
if (inputName in inputs){return inputs[inputName].input.value;}
	else if (inputName in inputs2){return inputs2[inputName].input.value;}
	else if (inputName in inputs3){return inputs3[inputName].input.value;}
	else return null
}

//тест рейд
/** Автоповтор миссии */
let isRepeatMission = false;
/** Вкл/Выкл автоповтор миссии */
this.switchRepeatMission = function() {
	isRepeatMission = !isRepeatMission;
	console.log(isRepeatMission);
}
//тест стоп
/**
 * Button List
 *
 * Список кнопочек
 */
const buttons = {
	getOutland: {
		name: I18N('TO_DO_EVERYTHING'),
		title: I18N('TO_DO_EVERYTHING_TITLE'),
		func: testDoYourBest,
	},
	/*
	doActions: {
		name: I18N('ACTIONS'),
		title: I18N('ACTIONS_TITLE'),
		func: async function () {
			const popupButtons = [
				{
					msg: I18N('OUTLAND'),
					result: function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('OUTLAND')}?`, getOutland);
					},
					title: I18N('OUTLAND_TITLE'),
				},
				{
					msg: I18N('TOWER'),
					result: function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('TOWER')}?`, testTower);
					},
					title: I18N('TOWER_TITLE'),
				},
				{
					msg: I18N('EXPEDITIONS'),
					result: function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('EXPEDITIONS')}?`, checkExpedition);
					},
					title: I18N('EXPEDITIONS_TITLE'),
				},
				{
					msg: I18N('MINIONS'),
					result: function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('MINIONS')}?`, testRaidNodes);
					},
					title: I18N('MINIONS_TITLE'),
				},
				{
					msg: I18N('ESTER_EGGS'),
					result: function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('ESTER_EGGS')}?`, offerFarmAllReward);
					},
					title: I18N('ESTER_EGGS_TITLE'),
				},
				{
					msg: I18N('STORM'),
					result: function () {
						testAdventure2('solo');
					},
					title: I18N('STORM_TITLE'),
				},
				{
					msg: I18N('REWARDS'),
					result: function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('REWARDS')}?`, questAllFarm);
					},
					title: I18N('REWARDS_TITLE'),
				},
				{
					msg: I18N('MAIL'),
					result: function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('MAIL')}?`, mailGetAll);
					},
					title: I18N('MAIL_TITLE'),
				},
				{
					msg: I18N('SEER'),
					result: function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('SEER')}?`, rollAscension);
					},
					title: I18N('SEER_TITLE'),
				},
                {
					msg: I18N('NY_GIFTS'),
					result: getGiftNewYear,
					title: I18N('NY_GIFTS_TITLE'),
				},
			];
			popupButtons.push({ result: false, isClose: true })
			const answer = await popup.confirm(`${I18N('CHOOSE_ACTION')}:`, popupButtons);
			if (typeof answer === 'function') {
				answer();
			}
		}
	},
	doOthers: {
		name: I18N('OTHERS'),
		title: I18N('OTHERS_TITLE'),
		func: async function () {
			const popupButtons = [
				{
					msg: I18N('GET_ENERGY'),
					result: farmStamina,
					title: I18N('GET_ENERGY_TITLE'),
				},
				{
					msg: I18N('ITEM_EXCHANGE'),
					result: fillActive,
					title: I18N('ITEM_EXCHANGE_TITLE'),
				},
				{
					msg: I18N('BUY_SOULS'),
					result: function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('BUY_SOULS')}?`, buyHeroFragments);
					},
					title: I18N('BUY_SOULS_TITLE'),
				},
				{
					msg: I18N('BUY_FOR_GOLD'),
					result: function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('BUY_FOR_GOLD')}?`, buyInStoreForGold);
					},
					title: I18N('BUY_FOR_GOLD_TITLE'),
				},
				{
					msg: I18N('BUY_OUTLAND'),
					result: function () {
						confShow(I18N('BUY_OUTLAND_TITLE') + '?', bossOpenChestPay);
					},
					title: I18N('BUY_OUTLAND_TITLE'),
				},
				{
					msg: I18N('AUTO_RAID_ADVENTURE'),
					result: autoRaidAdventure,
					title: I18N('AUTO_RAID_ADVENTURE_TITLE'),
				},
				{
					msg: I18N('CLAN_STAT'),
					result: clanStatistic,
					title: I18N('CLAN_STAT_TITLE'),
				},
				{
					msg: I18N('SECRET_WEALTH'),
					result: buyWithPetExperience,
					title: I18N('SECRET_WEALTH_TITLE'),
				},
				{
					msg: I18N('EPIC_BRAWL'),
					result: async function () {
						confShow(`${I18N('RUN_SCRIPT')} ${I18N('EPIC_BRAWL')}?`, () => {
							const brawl = new epicBrawl;
							brawl.start();
						});
					},
					title: I18N('EPIC_BRAWL_TITLE'),
				},
                {
					msg: I18N('CHANGE_MAP'),
					result: async function () {
						const result = await popup.confirm(I18N('SELECT_ISLAND_MAP'), [
							{ msg: I18N('FIRST_MAP'), result: 1 },
							{ msg: I18N('SECOND_MAP'), result: 2 },
							{ result: false, isClose: true },
						]
						);
						if (result) {
							cheats.changeIslandMap(result);
						}
					},
					title: I18N('CHANGE_MAP_TITLE'),
				},
			];
			popupButtons.push({ result: false, isClose: true })
			const answer = await popup.confirm(`${I18N('CHOOSE_ACTION')}:`, popupButtons);
			if (typeof answer === 'function') {
				answer();
			}
		}
	},*/
    changeIslandMap: {
        name: I18N('CHANGE_MAP'),
        title: I18N('CHANGE_MAP_TITLE'),
        func: async function () {
            const result = await popup.confirm(I18N('SELECT_ISLAND_MAP'), [
                { msg: I18N('FIRST_MAP'), result: 1 },
                { msg: I18N('SECOND_MAP'), result: 2 },
                { result: false, isClose: true },
            ]
                                              );
            if (result) {
                cheats.changeIslandMap(result);
            }
        },
    },
	testTitanArena: {
		name: I18N('TITAN_ARENA'),
		title: I18N('TITAN_ARENA_TITLE'),
		func: function () {
			confShow(`${I18N('RUN_SCRIPT')} ${I18N('TITAN_ARENA')}?`, testTitanArena);
		},
	},
    /* подземка есть в сделать все
	testDungeon: {
		name: I18N('DUNGEON'),
		title: I18N('DUNGEON_TITLE'),
		func: function () {
			confShow(`${I18N('RUN_SCRIPT')} ${I18N('DUNGEON')}?`, testDungeon);
		},
	},*/
	//тест подземка 2
	DungeonFull: {
        name: I18N('DUNGEON2'),
		title: I18N('DUNGEON_FULL_TITLE'),
		func: function () {
			confShow(`${I18N('RUN_SCRIPT')} ${I18N('DUNGEON_FULL_TITLE')}?`, DungeonFull);
		},
	},
    //остановить подземелье
	stopDungeon: {
		name: I18N('STOP_DUNGEON'),
		title: I18N('STOP_DUNGEON_TITLE'),
		func: function () {
			confShow(`${I18N('STOP_SCRIPT')} ${I18N('STOP_DUNGEON_TITLE')}?`, stopDungeon);
    	},
	},
    /*
	// Башня
	testTower: {
		name: I18N('TOWER'),
		title: I18N('TOWER_TITLE'),
		func: function () {
			confShow(`${I18N('RUN_SCRIPT')} ${I18N('TOWER')}?`, testTower);
		},
    },*/
    /*
	autoBoss: {
		name: 'autoBoss',
		title: 'autoBoss',
		func: function () {
			(new executeEventAutoBoss()).start()
		},
	},*/
	// Архидемон
	/*bossRatingEvent: {
		name: I18N('ARCHDEMON'),
		title: I18N('ARCHDEMON_TITLE'),
		func: function () {
			confShow(`${I18N('RUN_SCRIPT')} ${I18N('ARCHDEMON')}?`, bossRatingEventSouls); //bossRatingEvent - убрали
		},
	},*/
	// Горнило душ
	/*bossRatingEvent: {
		name: I18N('CRUCIBLE_SOULS'),
		title: I18N('CRUCIBLE_SOULS_TITLE'),
		func: function () {
			confShow(`${I18N('RUN_SCRIPT')} ${I18N('CRUCIBLE_SOULS')}?`, bossRatingEventSouls); //bossRatingEvent - убрали
		},
	},*/
	/*
	testAdventure2: {
		name: I18N('STORM'),
		title: I18N('STORM_TITLE'),
		func: () => {
			testAdventure2('solo');
		},
	},*/
	rewardsAndMailFarm: {
		name: I18N('REWARDS_AND_MAIL'),
		title: I18N('REWARDS_AND_MAIL_TITLE'),
		func: function () {
			confShow(`${I18N('RUN_SCRIPT')} ${I18N('REWARDS_AND_MAIL')}?`, rewardsAndMailFarm);
		},
	},
	//прислужники
    testRaidNodes: {
		name: I18N('MINIONS'),
		title: I18N('MINIONS_TITLE'),
		func: function () {
			confShow(`${I18N('RUN_SCRIPT')} ${I18N('MINIONS')}?`, testRaidNodes);
		},
	},
	//приключения
	testAdventure: {
		name: I18N('ADVENTURE'),
		title: I18N('ADVENTURE_TITLE'),
		func: () => {
			testAdventure();
		},
	},
	goToSanctuary: {
		name: I18N('SANCTUARY'),
		title: I18N('SANCTUARY_TITLE'),
		func: cheats.goSanctuary,
	},
	goToClanWar: {
		name: I18N('GUILD_WAR'),
		title: I18N('GUILD_WAR_TITLE'),
		func: cheats.goClanWar,
	},
	dailyQuests: {
		name: I18N('DAILY_QUESTS'),
		title: I18N('DAILY_QUESTS_TITLE'),
		func: async function () {
			const quests = new dailyQuests(() => { }, () => { });
			await quests.autoInit();
			quests.start();
		},
	},
	//подарок др
	NewYearGift_Clan: {
		name: I18N('New_Year_Clan'),
		title: I18N('New_Year_Clan_TITLE'),
		func: function () {
			confShow(`${I18N('RUN_SCRIPT')} ${I18N('New_Year_Clan_TITLE')}?`, NewYearGift_Clan);
		},
	},
	newDay: {
		name: I18N('SYNC'),
		title: I18N('SYNC_TITLE'),
		func: function () {
			confShow(`${I18N('RUN_SCRIPT')} ${I18N('SYNC')}?`, cheats.refreshGame);
		},
	},
}
/**
 * Display buttons
 *
 * Вывести кнопочки
 */
function addControlButtons() {
	for (let name in buttons) {
		button = buttons[name];
		button['button'] = scriptMenu.addButton(button.name, button.func, button.title);
	}
}
/**
 * Adds links
 *
 * Добавляет ссылки
 */
function addBottomUrls() {
	scriptMenu.addHeader(I18N('BOTTOM_URLS'));
}
/**
 * Stop repetition of the mission
 *
 * Остановить повтор миссии
 */
let isStopSendMission = false;
/**
 * There is a repetition of the mission
 *
 * Идет повтор миссии
 */
let isSendsMission = false;
/**
 * Data on the past mission
 *
 * Данные о прошедшей мисии
 */
let lastMissionStart = {}

/**
 * Data on the past attack on the boss
 *
 * Данные о прошедшей атаке на босса
 */
let lastBossBattle = {}
/**
 * Data for calculating the last battle with the boss
 *
 * Данные для расчете последнего боя с боссом
 */
let lastBossBattleInfo = null;
/**
 * Ability to cancel the battle in Asgard
 *
 * Возможность отменить бой в Астгарде
 */
let isCancalBossBattle = true;
/**
 * Information about the last battle
 *
 * Данные о прошедшей битве
 */
let lastBattleArg = {}
/**
 * The name of the function of the beginning of the battle
 *
 * Имя функции начала боя
 */
let nameFuncStartBattle = '';
/**
 * The name of the function of the end of the battle
 *
 * Имя функции конца боя
 */
let nameFuncEndBattle = '';
/**
 * Data for calculating the last battle
 *
 * Данные для расчета последнего боя
 */
let lastBattleInfo = null;
/**
 * The ability to cancel the battle
 *
 * Возможность отменить бой
 */
let isCancalBattle = true;

/**
 * Certificator of the last open nesting doll
 *
 * Идетификатор последней открытой матрешки
 */
let lastRussianDollId = null;
/**
 * Cancel the training guide
 *
 * Отменить обучающее руководство
 */
this.isCanceledTutorial = false;

/**
 * Data from the last question of the quiz
 *
 * Данные последнего вопроса викторины
 */
let lastQuestion = null;
/**
 * Answer to the last question of the quiz
 *
 * Ответ на последний вопрос викторины
 */
let lastAnswer = null;
/**
 * Flag for opening keys or titan artifact spheres
 *
 * Флаг открытия ключей или сфер артефактов титанов
 */
let artifactChestOpen = false;
/**
 * The name of the function to open keys or orbs of titan artifacts
 *
 * Имя функции открытия ключей или сфер артефактов титанов
 */
let artifactChestOpenCallName = '';
/**
 * Data for the last battle in the dungeon
 * (Fix endless cards)
 *
 * Данные для последнего боя в подземке
 * (Исправление бесконечных карт)
 */
let lastDungeonBattleData = null;
/**
 * Start time of the last battle in the dungeon
 *
 * Время начала последнего боя в подземелье
 */
let lastDungeonBattleStart = 0;
/**
 * Subscription end time
 *
 * Время окончания подписки
 */
let subEndTime = 0;
/**
 * Number of prediction cards
 *
 * Количество карт предсказаний
 */
let countPredictionCard = 0;

/**
 * Brawl pack
 *
 * Пачка для потасовок
 */
let brawlsPack = null;
/**
 * Autobrawl started
 *
 * Автопотасовка запущена
 */
let isBrawlsAutoStart = false;
/**
 * Timer divider
 *
 * Делитель таймера
 */
this.timerDiv = 1.5; //подземка динамический таймер
/**
 * Copies the text to the clipboard
 *
 * Копирует тест в буфер обмена
 * @param {*} text copied text // копируемый текст
 */
function copyText(text) {
	let copyTextarea = document.createElement("textarea");
	copyTextarea.style.opacity = "0";
	copyTextarea.textContent = text;
	document.body.appendChild(copyTextarea);
	copyTextarea.select();
	document.execCommand("copy");
	document.body.removeChild(copyTextarea);
	delete copyTextarea;
}
/**
 * Returns the history of requests
 *
 * Возвращает историю запросов
 */
this.getRequestHistory = function() {
	return requestHistory;
}
/**
 * Generates a random integer from min to max
 *
 * Гененирует случайное целое число от min до max
 */
const random = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
//тест подземка гудвин
	Number.prototype.round = function(places) {
        return +(Math.round(this + "e+" + places) + "e-" + places);
    }
    String.prototype.fixed = function(length) {
        return this.length < length ? this + ' '.repeat(2 * (length - this.length)): this ;
    }
/**
 * Clearing the request history
 *
 * Очистка истоии запросов
 */
setInterval(function () {
	let now = Date.now();
	for (let i in requestHistory) {
		if (now - i > 300000) {
			delete requestHistory[i];
		}
	}
}, 300000);
/**
 * DOM Loading Event page
 *
 * Событие загрузки DOM дерева страницы
 */
document.addEventListener("DOMContentLoaded", () => {
	/**
	 * Create the script interface
	 *
	 * Создание интерфеса скрипта
	 */
	createInterface();
});
/**
 * Gift codes collecting and sending codes
 *
 * Сбор и отправка кодов подарков
 */
function sendCodes() {
	let codes = [], count = 0;
	if (!localStorage['giftSendIds']) {
		localStorage['giftSendIds'] = '';
	}
	document.querySelectorAll('a[target="_blank"]').forEach(e => {
		let url = e?.href;
		if (!url) return;
		url = new URL(url);
		let giftId = url.searchParams.get('gift_id');
		if (!giftId || localStorage['giftSendIds'].includes(giftId)) return;
		localStorage['giftSendIds'] += ';' + giftId;
		codes.push(giftId);
		count++;
	});

	if (codes.length) {
		localStorage['giftSendIds'] = localStorage['giftSendIds'].split(';').splice(-50).join(';');
		sendGiftsCodes(codes);
	}

	if (!count) {
		setTimeout(sendCodes, 2000);
	}
}
/**
 * Checking sent codes
 *
 * Проверка отправленных кодов
 */
function checkSendGifts() {
	if (!freebieCheckInfo) {
		return;
	}

	let giftId = freebieCheckInfo.args.giftId;
	let valName = 'giftSendIds_' + userInfo.id;
	localStorage[valName] = localStorage[valName] ?? '';
	if (!localStorage[valName].includes(giftId)) {
		localStorage[valName] += ';' + giftId;
		sendGiftsCodes([giftId]);
	}
}
/**
 * Sending codes
 *
 * Отправка кодов
 */
function sendGiftsCodes(codes) {
	fetch('https://zingery.ru/heroes/setGifts.php', {
		method: 'POST',
		body: JSON.stringify(codes)
	}).then(
		response => response.json()
	).then(
		data => {
			if (data.result) {
				console.log(I18N('GIFTS_SENT'));
			}
		}
	)
}
/** тест убрано Возвращает объект если переданный парамет строка */
//тест гудвин хз надо ли
/** Возвращает объект если переданный парамет строка */
	function getJson(result) {
		if (typeof result == 'string') {
			result = JSON.parse(result);
		}
		if (result?.error) {
			console.warn(result.error);
			return false;
		}
		return result;
	}
//Гудвин
/**
 * Displays the dialog box
 *
 * Отображает диалоговое окно
 */
function confShow(message, yesCallback, noCallback) {
	let buts = [];
	message = message || I18N('DO_YOU_WANT');
	noCallback = noCallback || (() => {});
	if (yesCallback) {
		buts = [
			{ msg: I18N('BTN_RUN'), result: true},
			//{ msg: I18N('BTN_CANCEL'), result: false},
            { msg: I18N('BTN_CANCEL'), result: false, isCancel: true},
		]
	} else {
		yesCallback = () => {};
		buts = [
			{ msg: I18N('BTN_OK'), result: true},
		];
	}
	popup.confirm(message, buts).then((e) => {
        // dialogPromice = null;
		if (e) {
			yesCallback();
		} else {
			noCallback();
		}
	});
}
/**
 * Overriding/Proxying the Ajax Request Creation Method
 *
 * Переопределяем/проксируем метод создания Ajax запроса
 */
XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
	this.uniqid = Date.now();
	this.errorRequest = false;
	if (method == 'POST' && url.includes('.nextersglobal.com/api/') && /api\/$/.test(url)) {
		if (!apiUrl) {
			apiUrl = url;
			const socialInfo = /heroes-(.+?)\./.exec(apiUrl);
			console.log(socialInfo);
		}
		requestHistory[this.uniqid] = {
			method,
			url,
			error: [],
			headers: {},
			request: null,
			response: null,
			signature: [],
			calls: {},
		};
	} else if (method == 'POST' && url.includes('error.nextersglobal.com/client/')) {
		this.errorRequest = true;
	}
	return original.open.call(this, method, url, async, user, password);
};
/**
 * Overriding/Proxying the header setting method for the AJAX request
 *
 * Переопределяем/проксируем метод установки заголовков для AJAX запроса
 */
XMLHttpRequest.prototype.setRequestHeader = function (name, value, check) {
	if (this.uniqid in requestHistory) {
		requestHistory[this.uniqid].headers[name] = value;
	} else {
		check = true;
	}

	if (name == 'X-Auth-Signature') {
		requestHistory[this.uniqid].signature.push(value);
		if (!check) {
			return;
		}
	}

	return original.setRequestHeader.call(this, name, value);
};
/**
 * Overriding/Proxying the AJAX Request Sending Method
 *
 * Переопределяем/проксируем метод отправки AJAX запроса
 */
XMLHttpRequest.prototype.send = async function (sourceData) {
	if (this.uniqid in requestHistory) {
		let tempData = null;
		if (getClass(sourceData) == "ArrayBuffer") {
			tempData = decoder.decode(sourceData);
		} else {
			tempData = sourceData;
		}
		requestHistory[this.uniqid].request = tempData;
		let headers = requestHistory[this.uniqid].headers;
		lastHeaders = Object.assign({}, headers);
		/**
		 * Game loading event
		 *
		 * Событие загрузки игры
		 */
		if (headers["X-Request-Id"] > 2 && !isLoadGame) {
			isLoadGame = true;
			await lib.load();
			addControls();
			addControlButtons();
			addBottomUrls();

			//if (isChecked('sendExpedition')) {
				checkExpedition(); //экспедиции на авто
			//}

			checkSendGifts();
			getAutoGifts();

			cheats.activateHacks();

			justInfo();
			if (isChecked('dailyQuests')) {
				testDailyQuests();
			}

			if (isChecked('secretWealth')) {
				buyWithPetExperienceAuto();
			}

			if (isChecked('buyForGold')) {
				buyInStoreForGold();
			}
		}
		/**
		 * Outgoing request data processing
		 *
		 * Обработка данных исходящего запроса
		 */
		sourceData = await checkChangeSend.call(this, sourceData, tempData);
		/**
		 * Handling incoming request data
		 *
		 * Обработка данных входящего запроса
		 */
		const oldReady = this.onreadystatechange;
		this.onreadystatechange = async function (e) {
			if(this.readyState == 4 && this.status == 200) {
				isTextResponse = this.responseType === "text" || this.responseType === "";
				let response = isTextResponse ? this.responseText : this.response;
				requestHistory[this.uniqid].response = response;
				/**
				 * Replacing incoming request data
				 *
				 * Замена данных входящего запроса
				 */
				if (isTextResponse) {
					await checkChangeResponse.call(this, response);
				}
				/**
				 * A function to run after the request is executed
				 *
				 * Функция запускаемая после выполения запроса
				 */
				if (typeof this.onReadySuccess == 'function') {
					setTimeout(this.onReadySuccess, 500);
				}
			}
			if (oldReady) {
				return oldReady.apply(this, arguments);
			}
		}
	}
	if (this.errorRequest) {
		const oldReady = this.onreadystatechange;
		this.onreadystatechange = function () {
			Object.defineProperty(this, 'status', {
				writable: true
			});
			this.status = 200;
			Object.defineProperty(this, 'readyState', {
				writable: true
			});
			this.readyState = 4;
			Object.defineProperty(this, 'responseText', {
				writable: true
			});
			this.responseText = JSON.stringify({
				"result": true
			});
			return oldReady.apply(this, arguments);
		}
		this.onreadystatechange();
	} else {
		try {
			return original.send.call(this, sourceData);
		} catch(e) {
			debugger;
		}

	}
};
/**
 * Processing and substitution of outgoing data
 *
 * Обработка и подмена исходящих данных
 */
async function checkChangeSend(sourceData, tempData) {
	try {
		/**
		 * A function that replaces battle data with incorrect ones to cancel combatя
		 *
		 * Функция заменяющая данные боя на неверные для отмены боя
		 */
		const fixBattle = function (heroes) {
			for (const ids in heroes) {
				hero = heroes[ids];
				hero.energy = random(1, 999);
				if (hero.hp > 0) {
					hero.hp = random(1, hero.hp);
				}
			}
		}
		/**
		 * Dialog window 2
		 *
		 * Диалоговое окно 2
		 */
		const showMsg = async function (msg, ansF, ansS) {
			if (typeof popup == 'object') {
				return await popup.confirm(msg, [
					{msg: ansF, result: false},
					{msg: ansS, result: true},
				]);
			} else {
				return !confirm(`${msg}\n ${ansF} (${I18N('BTN_OK')})\n ${ansS} (${I18N('BTN_CANCEL')})`);
			}
		}
		/**
		 * Dialog window 3
		 *
		 * Диалоговое окно 3
		 */
		const showMsgs = async function (msg, ansF, ansS, ansT) {
			return await popup.confirm(msg, [
				{msg: ansF, result: 0},
				{msg: ansS, result: 1},
				{msg: ansT, result: 2},
			]);
		}

		let changeRequest = false;
		testData = JSON.parse(tempData);
		for (const call of testData.calls) {
			if (!artifactChestOpen) {
				requestHistory[this.uniqid].calls[call.name] = call.ident;
			}
			/**
			 * Cancellation of the battle in adventures, on VG and with minions of Asgard
			 * Отмена боя в приключениях, на ВГ и с прислужниками Асгарда
			 */
			if ((call.name == 'adventure_endBattle' ||
				call.name == 'adventureSolo_endBattle' ||
				call.name == 'clanWarEndBattle' &&
				isChecked('cancelBattle') ||
				call.name == 'crossClanWar_endBattle' &&
				isChecked('cancelBattle') ||
				call.name == 'brawl_endBattle' ||
				call.name == 'towerEndBattle' ||
				call.name == 'invasion_bossEnd' ||
				call.name == 'bossEndBattle' ||
				call.name == 'clanRaid_endNodeBattle') &&
				isCancalBattle) {
				nameFuncEndBattle = call.name;
				if (!call.args.result.win) {
					let resultPopup = false;
					if (call.name == 'adventure_endBattle' ||
						call.name == 'invasion_bossEnd' ||
						call.name == 'bossEndBattle' ||
						call.name == 'adventureSolo_endBattle') {
						resultPopup = await showMsgs(I18N('MSG_HAVE_BEEN_DEFEATED'), I18N('BTN_OK'), I18N('BTN_CANCEL'), I18N('BTN_AUTO'));
					} else if (call.name == 'clanWarEndBattle' ||
							call.name == 'crossClanWar_endBattle') {
						resultPopup = await showMsg(I18N('MSG_HAVE_BEEN_DEFEATED'), I18N('BTN_OK'), I18N('BTN_AUTO_F5'));
					} else {
						resultPopup = await showMsg(I18N('MSG_HAVE_BEEN_DEFEATED'), I18N('BTN_OK'), I18N('BTN_CANCEL'));
					}
					if (resultPopup) {
						fixBattle(call.args.progress[0].attackers.heroes);
						fixBattle(call.args.progress[0].defenders.heroes);
						changeRequest = true;
						if (resultPopup > 1) {
							this.onReadySuccess = testAutoBattle;
							// setTimeout(bossBattle, 1000);
						}
					}
				} else if (call.args.result.stars < 3 && call.name == 'towerEndBattle') {
					resultPopup = await showMsg(I18N('LOST_HEROES'), I18N('BTN_OK'), I18N('BTN_CANCEL'), I18N('BTN_AUTO'));
					if (resultPopup) {
						fixBattle(call.args.progress[0].attackers.heroes);
						fixBattle(call.args.progress[0].defenders.heroes);
						changeRequest = true;
						if (resultPopup > 1) {
							this.onReadySuccess = testAutoBattle;
						}
					}
				}
				// Потасовки
				if (isChecked('autoBrawls') && !isBrawlsAutoStart && call.name == 'brawl_endBattle') {
					if (await popup.confirm(I18N('START_AUTO_BRAWLS'), [
						{ msg: I18N('BTN_NO'), result: false },
						{ msg: I18N('BTN_YES'), result: true },
					])) {
						this.onReadySuccess = testBrawls;
						isBrawlsAutoStart = true;
					}
				}
			}
			/**
			 * Save pack for Brawls
			 *
			 * Сохраняем пачку для потасовок
			 */
			if (call.name == 'brawl_startBattle') {
				console.log(JSON.stringify(call.args));
				brawlsPack = call.args;
			}
			/**
			 * Canceled fight in Asgard
			 * Отмена боя в Асгарде
			 */
			if (call.name == 'clanRaid_endBossBattle' &&
				isCancalBossBattle &&
				isChecked('cancelBattle')) {
				bossDamage = call.args.progress[0].defenders.heroes[1].extra;
				sumDamage = bossDamage.damageTaken + bossDamage.damageTakenNextLevel;
				let resultPopup = await showMsgs(
					`${I18N('MSG_YOU_APPLIED')} ${sumDamage.toLocaleString()} ${I18N('MSG_DAMAGE')}.`,
					I18N('BTN_OK'), I18N('BTN_AUTO_F5'), I18N('MSG_CANCEL_AND_STAT'))
				if (resultPopup) {
					fixBattle(call.args.progress[0].attackers.heroes);
					fixBattle(call.args.progress[0].defenders.heroes);
					changeRequest = true;
					if (resultPopup > 1) {
						this.onReadySuccess = testBossBattle;
						// setTimeout(bossBattle, 1000);
					}
				}
			}
			/**
			 * Save the Asgard Boss Attack Pack
			 * Сохраняем пачку для атаки босса Асгарда
			 */
			if (call.name == 'clanRaid_startBossBattle') {
				lastBossBattle = call.args;
			}
			/**
			 * Saving the request to start the last battle
			 * Сохранение запроса начала последнего боя
			 */
			if (call.name == 'clanWarAttack' ||
				call.name == 'crossClanWar_startBattle' ||
				//call.name == 'invasion_bossStart' ||  тест убрано
				call.name == 'adventure_turnStartBattle' ||
				call.name == 'bossAttack' ||
				call.name == 'invasion_bossStart' ||
				call.name == 'towerStartBattle') {
				nameFuncStartBattle = call.name;
				lastBattleArg = call.args;
			}
			/**
			 * Disable spending divination cards
			 * Отключить трату карт предсказаний
			 */
			if (call.name == 'dungeonEndBattle') {
				if (call.args.isRaid) {
					if (countPredictionCard <= 0) {
						delete call.args.isRaid;
						changeRequest = true;
					} else if (countPredictionCard > 0) {
						countPredictionCard--;
					}
				}
				console.log(`Cards: ${countPredictionCard}`);
				/**
				 * Fix endless cards
				 * Исправление бесконечных карт
				 */
				const lastBattle = lastDungeonBattleData;
				if (lastBattle && !call.args.isRaid) {
					if (changeRequest) {
						lastBattle.progress = [{ attackers: { input: ["auto", 0, 0, "auto", 0, 0] } }];
					} else {
						lastBattle.progress = call.args.progress;
					}
					const result = await Calc(lastBattle);
					if (changeRequest) {
						call.args.progress = result.progress;
						call.args.result = result.result;
					}

					let timer = getTimer(result.battleTime);
					const period = Math.ceil((Date.now() - lastDungeonBattleStart) / 1000);
					console.log(timer, period);
					if (period < timer) {
						timer = timer - period;
						await countdownTimer(timer);
					}

				}
			}
			/**
			 * Quiz Answer
			 * Ответ на викторину
			 */
			if (call.name == 'quizAnswer') {
				/**
				 * Automatically changes the answer to the correct one if there is one.
				 * Автоматически меняет ответ на правильный если он есть
				 */
				if (lastAnswer && isChecked('getAnswer')) {
					call.args.answerId = lastAnswer;
					lastAnswer = null;
					changeRequest = true;
				}
			}
			/**
			 * Present
			 * Подарки
			 */
			if (call.name == 'freebieCheck') {
				freebieCheckInfo = call;
			}
			/**
			 * Getting mission data for auto-repeat
			 * Получение данных миссии для автоповтора
			 */
			if ((isRepeatMission || isChecked('isRepeatMission')) &&
			call.name == 'missionEnd') {
				let missionInfo = {
					id: call.args.id,
					result: call.args.result,
					heroes: call.args.progress[0].attackers.heroes,
					count: 0,
				}
				setTimeout(async () => {
					if (!isSendsMission && await popup.confirm(I18N('MSG_REPEAT_MISSION'), [
							{ msg: I18N('BTN_REPEAT'), result: true},
							{ msg: I18N('BTN_NO'), result: false},
						])) {
						isStopSendMission = false;
						isSendsMission = true;
						sendsMission(missionInfo);
					}
				}, 0);
			}
			/**
			 * Getting mission data
			 * Получение данных миссии
			 */
			if (call.name == 'missionStart') {
				lastMissionStart = call.args;
			}
			/**
			 * Specify the quantity for Titan Orbs and Pet Eggs
			 * Указать количество для сфер титанов и яиц петов
			 */
			if (isChecked('countControl') &&
				(call.name == 'pet_chestOpen' ||
				call.name == 'titanUseSummonCircle') &&
				call.args.amount > 1) {
				call.args.amount = 1;
				const result = await popup.confirm(I18N('MSG_SPECIFY_QUANT'), [
					{ msg: I18N('BTN_OPEN'), isInput: true, default: call.args.amount},
					]);
				if (result) {
					call.args.amount = result;
					changeRequest = true;
				}
			}
			/**
			 * Specify the amount for keys and spheres of titan artifacts
			 * Указать колличество для ключей и сфер артефактов титанов
			 */
			if (isChecked('countControl') &&
				(call.name == 'artifactChestOpen' ||
				call.name == 'titanArtifactChestOpen') &&
				call.args.amount > 1 &&
				call.args.free &&
				!changeRequest) {
				artifactChestOpenCallName = call.name;
				let result = await popup.confirm(I18N('MSG_SPECIFY_QUANT'), [
					{ msg: I18N('BTN_OPEN'), isInput: true, default: call.args.amount },
				]);
				if (result) {
					let sphere = result < 10 ? 1 : 10;

					call.args.amount = sphere;
					result -= sphere;

					for (let count = result; count > 0; count -= sphere) {
						if (count < 10) sphere = 1;
						const ident = artifactChestOpenCallName + "_" + count;
						testData.calls.push({
							name: artifactChestOpenCallName,
							args: {
								amount: sphere,
								free: true,
							},
							ident: ident
						});
						if (!Array.isArray(requestHistory[this.uniqid].calls[call.name])) {
							requestHistory[this.uniqid].calls[call.name] = [requestHistory[this.uniqid].calls[call.name]];
						}
						requestHistory[this.uniqid].calls[call.name].push(ident);
					}

					artifactChestOpen = true;
					changeRequest = true;
				}
			}
			if (call.name == 'consumableUseLootBox') {
				lastRussianDollId = call.args.libId;
				/**
				 * Specify quantity for gold caskets
				 * Указать количество для золотых шкатулок
				 */
				if (isChecked('countControl') &&
					call.args.libId == 148 &&
					call.args.amount > 1) {
					const result = await popup.confirm(I18N('MSG_SPECIFY_QUANT'), [
						{ msg: I18N('BTN_OPEN'), isInput: true, default: call.args.amount},
					]);
					call.args.amount = result;
					changeRequest = true;
				}
			}
			/**
			 * Adding a request to receive 26 store
			 * Добавление запроса на получение 26 магазина
			 */
			if (call.name == 'registration') {
				/*
				testData.calls.push({
					name: "shopGet",
					args: {
						shopId: "26"
					},
					ident: "shopGet"
				});
				changeRequest = true;
				*/
			}
			/**
			 * Changing the maximum number of raids in the campaign
			 * Изменение максимального количества рейдов в кампании
			 */
			// if (call.name == 'missionRaid') {
			// 	if (isChecked('countControl') && call.args.times > 1) {
			// 		const result = +(await popup.confirm(I18N('MSG_SPECIFY_QUANT'), [
			// 			{ msg: I18N('BTN_RUN'), isInput: true, default: call.args.times },
			// 		]));
			// 		call.args.times = result > call.args.times ? call.args.times : result;
			// 		changeRequest = true;
			// 	}
			// }
		}

		let headers = requestHistory[this.uniqid].headers;
		if (changeRequest) {
			sourceData = JSON.stringify(testData);
			headers['X-Auth-Signature'] = getSignature(headers, sourceData);
		}

		let signature = headers['X-Auth-Signature'];
		if (signature) {
			original.setRequestHeader.call(this, 'X-Auth-Signature', signature);
		}
	} catch (err) {
		console.log("Request(send, " + this.uniqid + "):\n", sourceData, "Error:\n", err);
	}
	return sourceData;
}
/**
 * Processing and substitution of incoming data
 *
 * Обработка и подмена входящих данных
 */
async function checkChangeResponse(response) {
	try {
		isChange = false;
		let nowTime = Math.round(Date.now() / 1000);
		callsIdent = requestHistory[this.uniqid].calls;
		respond = JSON.parse(response);
		/**
		 * If the request returned an error removes the error (removes synchronization errors)
		 * Если запрос вернул ошибку удаляет ошибку (убирает ошибки синхронизации)
		 */
		if (respond.error) {
			isChange = true;
			console.error(respond.error);
			if (isChecked('showErrors')) {
				popup.confirm(I18N('ERROR_MSG', {
					name: respond.error.name,
					description: respond.error.description,
				}));
			}
			delete respond.error;
			respond.results = [];
		}
		let mainReward = null;
		const allReward = {};
		let readQuestInfo = false;
		for (const call of respond.results) {
			/**
			 * Obtaining initial data for completing quests
			 * Получение исходных данных для выполнения квестов
			 */
			if (readQuestInfo) {
				questsInfo[call.ident] = call.result.response;
			}
			/**
			 * Getting a user ID
			 * Получение идетификатора пользователя
			 */
			if (call.ident == callsIdent['registration']) {
				userId = call.result.response.userId;
				await openOrMigrateDatabase(userId);
				readQuestInfo = true;
			}
			/**
			 * Endless lives in brawls
			 * Бесконечные жизни в потасовках
			 */
			/*
			if (getSaveVal('autoBrawls') && call.ident == callsIdent['brawl_getInfo']) {
				brawl = call.result.response;
				if (brawl) {
					brawl.boughtEndlessLivesToday = 1;
					isChange = true;
				}
			}
			*/
			/**
			 * Hiding donation offers 1
			 * Скрываем предложения доната 1
			 */
			if (call.ident == callsIdent['billingGetAll'] && getSaveVal('noOfferDonat')) {
				const billings = call.result.response?.billings;
				const bundle = call.result.response?.bundle;
				if (billings && bundle) {
					call.result.response.billings = [];
					call.result.response.bundle = [];
					isChange = true;
				}
			}
			/**
			 * Hiding donation offers 2
			 * Скрываем предложения доната 2
			 */
			if (getSaveVal('noOfferDonat') &&
				(call.ident == callsIdent['offerGetAll'] ||
					call.ident == callsIdent['specialOffer_getAll'])) {
				let offers = call.result.response;
				if (offers) {
					call.result.response = offers.filter(e => !['addBilling', 'bundleCarousel'].includes(e.type) || ['idleResource'].includes(e.offerType));
					isChange = true;
				}
			}
			/**
			 * Hiding donation offers 3
			 * Скрываем предложения доната 3
			 */
			if (getSaveVal('noOfferDonat') && call.result?.bundleUpdate) {
				delete call.result.bundleUpdate;
				isChange = true;
			}
			/**
			 * Copies a quiz question to the clipboard
			 * Копирует вопрос викторины в буфер обмена и получает на него ответ если есть
			 */
			if (call.ident == callsIdent['quizGetNewQuestion']) {
				let quest = call.result.response;
				console.log(quest.question);
				copyText(quest.question);
				setProgress(I18N('QUESTION_COPY'), true);
				quest.lang = null;
				if (typeof NXFlashVars !== 'undefined') {
					quest.lang = NXFlashVars.interface_lang;
				}
				lastQuestion = quest;
				if (isChecked('getAnswer')) {
					const answer = await getAnswer(lastQuestion);
					if (answer) {
						lastAnswer = answer;
						console.log(answer);
						setProgress(`${I18N('ANSWER_KNOWN')}: ${answer}`, true);
					} else {
						setProgress(I18N('ANSWER_NOT_KNOWN'), true);
					}
				}
			}
			/**
			 * Submits a question with an answer to the database
			 * Отправляет вопрос с ответом в базу данных
			 */
			if (call.ident == callsIdent['quizAnswer']) {
				const answer = call.result.response;
				if (lastQuestion) {
					const answerInfo = {
						answer,
						question: lastQuestion,
						lang: null,
					}
					if (typeof NXFlashVars !== 'undefined') {
						answerInfo.lang = NXFlashVars.interface_lang;
					}
					lastQuestion = null;
					setTimeout(sendAnswerInfo, 0, answerInfo);
				}
			}
			/**
			 * Get user data
			 * Получить даныне пользователя
			 */
			if (call.ident == callsIdent['userGetInfo']) {
				let user = call.result.response;
				userInfo = Object.assign({}, user);
				delete userInfo.refillable;
				if (!questsInfo['userGetInfo']) {
					questsInfo['userGetInfo'] = user;
				}
			}
			/**
			 * Start of the battle for recalculation
			 * Начало боя для прерасчета
			 */
			if ((call.ident == callsIdent['clanWarAttack'] ||
				call.ident == callsIdent['crossClanWar_startBattle'] ||
				call.ident == callsIdent['bossAttack'] ||
				call.ident == callsIdent['battleGetReplay'] ||
				call.ident == callsIdent['brawl_startBattle'] ||
				call.ident == callsIdent['adventureSolo_turnStartBattle'] ||
				call.ident == callsIdent['invasion_bossStart'] ||
				call.ident == callsIdent['towerStartBattle'] ||
				call.ident == callsIdent['adventure_turnStartBattle']) &&
				isChecked('preCalcBattle')) {
				let battle = call.result.response.battle || call.result.response.replay;
				if (call.ident == callsIdent['brawl_startBattle'] ||
					call.ident == callsIdent['bossAttack'] ||
					call.ident == callsIdent['towerStartBattle'] ||
					call.ident == callsIdent['invasion_bossStart']) {
					battle = call.result.response;
				}
				lastBattleInfo = battle;
				if (!isChecked('preCalcBattle')) {
					continue;
				}
				setProgress(I18N('BEING_RECALC'));
				let battleDuration = 120;
				try {
					const typeBattle = getBattleType(battle.type);
					battleDuration = +lib.data.battleConfig[typeBattle.split('_')[1]].config.battleDuration;
				} catch (e) { }
				//console.log(battle.type);
				function getBattleInfo(battle, isRandSeed) {
					return new Promise(function (resolve) {
						if (isRandSeed) {
							battle.seed = Math.floor(Date.now() / 1000) + random(0, 1e3);
						}
						BattleCalc(battle, getBattleType(battle.type), e => resolve(e));
					});
				}
				let actions = [getBattleInfo(battle, false)]
				const countTestBattle = getInput('countTestBattle');
				if (call.ident == callsIdent['battleGetReplay']) {
					battle.progress = [{ attackers: { input: ["auto", 0, 0, "auto", 0, 0] } }];
				}
				for (let i = 0; i < countTestBattle; i++) {
					actions.push(getBattleInfo(battle, true));
				}
				Promise.all(actions)
					.then(e => {
						e = e.map(n => ({win: n.result.win, time: n.battleTime}));
						let firstBattle = e.shift();
						const timer = Math.floor(battleDuration - firstBattle.time);
						const min = ('00' + Math.floor(timer / 60)).slice(-2);
						const sec = ('00' + Math.floor(timer - min * 60)).slice(-2);
						const countWin = e.reduce((w, s) => w + s.win, 0);
						setProgress(`${I18N('THIS_TIME')} ${(firstBattle.win ? I18N('VICTORY') : I18N('DEFEAT'))} ${I18N('CHANCE_TO_WIN')}: ${Math.floor(countWin / e.length * 100)}% (${e.length}), ${min}:${sec}`, false, hideProgress)
					});
			}
			//тест сохранки
			/** Запоминаем команды в реплее*/
                if (call.ident == callsIdent['battleGetReplay']) {
                    let battle = call.result.response.replay;
                    repleyBattle.attackers = battle.attackers;
                    repleyBattle.defenders = battle.defenders[0];
                    repleyBattle.effects = battle.effects.defenders;
                    repleyBattle.state = battle.progress[0].defenders.heroes;
                    repleyBattle.seed = battle.seed;
                }
				/** Нападение в турнире*/
				if (call.ident == callsIdent['titanArenaStartBattle']) {
                    let bestBattle = getInput('countBattle');
                    let unrandom = getInput('needResource');
                    let maxPower = getInput('needResource2');
                    if (bestBattle * unrandom * maxPower == 0) {
                        let battle = call.result.response.battle;
                        if (bestBattle == 0) {
                            battle.progress = bestLordBattle[battle.typeId]?.progress;
                        }
                        if (unrandom == 0 && !!repleyBattle.seed) {
                            battle.seed = repleyBattle.seed;
                        }
                        if (maxPower == 0) {
                            battle.attackers = getTitansPack(Object.keys(battle.attackers));
                        }
                        isChange = true;
                    }
                }
                /** Тест боев с усилениями команд защиты*/
                if (call.ident == callsIdent['chatAcceptChallenge']) {
                    let battle = call.result.response.battle;
                    addBuff(battle);
                    let testType = getInput('countBattle');
                    if (testType.slice(0, 1) == "-") {
                        testType = parseInt(testType.slice(1), 10);
                        switch (testType) {
                            case 1:
                                battle.defenders[0] = repleyBattle.defenders;
                                break; //наша атака против защиты из реплея
                            case 2:
                                battle.defenders[0] = repleyBattle.attackers;
                                break; //наша атака против атаки из реплея
                            case 3:
                                battle.attackers = repleyBattle.attackers;
                                break; //атака из реплея против защиты в чате
                            case 4:
                                battle.attackers = repleyBattle.defenders;
                                break; //защита из реплея против защиты в чате
                            case 5:
                                battle.attackers = repleyBattle.attackers;
                                battle.defenders[0] = repleyBattle.defenders;
                                break; //атака из реплея против защиты из реплея
                            case 6:
                                battle.attackers = repleyBattle.defenders;
                                battle.defenders[0] = repleyBattle.attackers;
                                break; //защита из реплея против атаки из реплея
                            case 7:
                                battle.attackers = repleyBattle.attackers;
                                battle.defenders[0] = repleyBattle.attackers;
                                break; //атака из реплея против атаки из реплея
                            case 8:
                                battle.attackers = repleyBattle.defenders;
                                battle.defenders[0] = repleyBattle.defenders;
                                break; //защита из реплея против защиты из реплея
                        }
                    }

                    isChange = true;
                }
				/** Тест боев с усилениями команд защиты тренировках*/
                if (call.ident == callsIdent['demoBattles_startBattle']) {
                    let battle = call.result.response.battle;
                    addBuff(battle);
                    let testType = getInput('countBattle');
                    if (testType.slice(0, 1) == "-") {
                        testType = parseInt(testType.slice(1), 10);
                        switch (testType) {
                            case 1:
                                battle.defenders[0] = repleyBattle.defenders;
                                break; //наша атака против защиты из реплея
                            case 2:
                                battle.defenders[0] = repleyBattle.attackers;
                                break; //наша атака против атаки из реплея
                            case 3:
                                battle.attackers = repleyBattle.attackers;
                                break; //атака из реплея против защиты в чате
                            case 4:
                                battle.attackers = repleyBattle.defenders;
                                break; //защита из реплея против защиты в чате
                            case 5:
                                battle.attackers = repleyBattle.attackers;
                                battle.defenders[0] = repleyBattle.defenders;
                                break; //атака из реплея против защиты из реплея
                            case 6:
                                battle.attackers = repleyBattle.defenders;
                                battle.defenders[0] = repleyBattle.attackers;
                                break; //защита из реплея против атаки из реплея
                            case 7:
                                battle.attackers = repleyBattle.attackers;
                                battle.defenders[0] = repleyBattle.attackers;
                                break; //атака из реплея против атаки из реплея
                            case 8:
                                battle.attackers = repleyBattle.defenders;
                                battle.defenders[0] = repleyBattle.defenders;
                                break; //защита из реплея против защиты из реплея
                        }
                    }

                    isChange = true;
                }
			//тест сохранки
			/**
			 * Start of the Asgard boss fight
			 * Начало боя с боссом Асгарда
			 */
			if (call.ident == callsIdent['clanRaid_startBossBattle']) {
				lastBossBattleInfo = call.result.response.battle;
				if (isChecked('preCalcBattle')) {
					const result = await Calc(lastBossBattleInfo).then(e => e.progress[0].defenders.heroes[1].extra);
					const bossDamage = result.damageTaken + result.damageTakenNextLevel;
					setProgress(I18N('BOSS_DAMAGE') + bossDamage.toLocaleString(), false, hideProgress);
				}
			}
			/**
			 * Cancel tutorial
			 * Отмена туториала
			 */
			if (isCanceledTutorial && call.ident == callsIdent['tutorialGetInfo']) {
				let chains = call.result.response.chains;
				for (let n in chains) {
					chains[n] = 9999;
				}
				isChange = true;
			}
			/**
			 * Opening keys and spheres of titan artifacts
			 * Открытие ключей и сфер артефактов титанов
			 */
			if (artifactChestOpen &&
				(call.ident == callsIdent[artifactChestOpenCallName] ||
					(callsIdent[artifactChestOpenCallName] && callsIdent[artifactChestOpenCallName].includes(call.ident)))) {
				let reward = call.result.response[artifactChestOpenCallName == 'artifactChestOpen' ? 'chestReward' : 'reward'];

				reward.forEach(e => {
					for (let f in e) {
						if (!allReward[f]) {
							allReward[f] = {};
						}
						for (let o in e[f]) {
							if (!allReward[f][o]) {
								allReward[f][o] = e[f][o];
							} else {
								allReward[f][o] += e[f][o];
							}
						}
					}
				});

				if (!call.ident.includes(artifactChestOpenCallName)) {
					mainReward = call.result.response;
				}
			}

			/**
			 * Sum the result of opening Pet Eggs
			 * Суммирование результата открытия яиц питомцев
			 */
			if (isChecked('countControl') && call.ident == callsIdent['pet_chestOpen']) {
				const rewards = call.result.response.rewards;
				rewards.forEach(e => {
					for (let f in e) {
						if (!allReward[f]) {
							allReward[f] = {};
						}
						for (let o in e[f]) {
							if (!allReward[f][o]) {
								allReward[f][o] = e[f][o];
							} else {
								allReward[f][o] += e[f][o];
							}
						}
					}
				});
				call.result.response.rewards = [allReward];
				isChange = true;
			}
			/**
			 * Auto-repeat opening matryoshkas
			 * АвтоПовтор открытия матрешек
			 */
			if (isChecked('countControl') && call.ident == callsIdent['consumableUseLootBox']) {
				let lootBox = call.result.response;
				let newCount = 0;
				for (let n of lootBox) {
					if (n?.consumable && n.consumable[lastRussianDollId]) {
						newCount += n.consumable[lastRussianDollId]
					}
				}
				if (newCount && await popup.confirm(`${I18N('BTN_OPEN')} ${newCount} ${I18N('OPEN_DOLLS')}?`, [
						{ msg: I18N('BTN_OPEN'), result: true},
						{ msg: I18N('BTN_NO'), result: false},
					])) {
					const recursionResult = await openRussianDolls(lastRussianDollId, newCount);
					lootBox = [...lootBox, ...recursionResult];
				}
				/** Объединение результата лутбоксов */
				const allLootBox = {};
				lootBox.forEach(e => {
					for (let f in e) {
						if (!allLootBox[f]) {
							if (typeof e[f] == 'object') {
								allLootBox[f] = {};
							} else {
								allLootBox[f] = 0;
							}
						}
						if (typeof e[f] == 'object') {
							for (let o in e[f]) {
								if (newCount && o == lastRussianDollId) {
									continue;
								}
								if (!allLootBox[f][o]) {
									allLootBox[f][o] = e[f][o];
								} else {
									allLootBox[f][o] += e[f][o];
								}
							}
						} else {
							allLootBox[f] += e[f];
						}
					}
				});
				/** Разбитие результата */
				const output = [];
				const maxCount = 5;
				let currentObj = {};
				let count = 0;
				for (let f in allLootBox) {
					if (!currentObj[f]) {
						if (typeof allLootBox[f] == 'object') {
							for (let o in allLootBox[f]) {
								currentObj[f] ||= {}
								if (!currentObj[f][o]) {
									currentObj[f][o] = allLootBox[f][o];
									count++;
									if (count === maxCount) {
										output.push(currentObj);
										currentObj = {};
										count = 0;
									}
								}
							}
						} else {
							currentObj[f] = allLootBox[f];
							count++;
							if (count === maxCount) {
								output.push(currentObj);
								currentObj = {};
								count = 0;
							}
						}
					}
				}
				if (count > 0) {
					output.push(currentObj);
				}

				console.log(output);
				call.result.response = output;
				isChange = true;
			}
			/**
			 * Dungeon recalculation (fix endless cards)
			 * Прерасчет подземки (исправление бесконечных карт)
			 */
			if (call.ident == callsIdent['dungeonStartBattle']) {
				lastDungeonBattleData = call.result.response;
				lastDungeonBattleStart = Date.now();
			}
			/**
			 * Getting the number of prediction cards
			 * Получение количества карт предсказаний
			 */
			if (call.ident == callsIdent['inventoryGet']) {
				countPredictionCard = call.result.response.consumable[81] || 0;
			}
			/**
			 * Adding 26 and 28 store to other stores
			 * Добавление 26 и 28 магазина к остальным магазинам
			 */
			if (call.ident == callsIdent['shopGetAll']) {
				if (userInfo.level >= 10) {
					const result = await Send({ calls: [
						{ name: "shopGet", args: { shopId: "26" }, ident: "shopGet_26" },
						{ name: "shopGet", args: { shopId: "28" }, ident: "shopGet_28" },
						{ name: "shopGet", args: { shopId: "29" }, ident: "shopGet_29" },
					] }).then(e => e.results);
					call.result.response[26] = result[0].result.response;
					call.result.response[28] = result[1].result.response;
					call.result.response[29] = result[2].result.response;
					isChange = true;
				}
			}
			/**
			 * Getting subscription status
			 * Получение состояния подписки
			 */
			if (call.ident == callsIdent['subscriptionGetInfo']) {
				const subscription = call.result.response.subscription;
				if (subscription) {
					subEndTime = subscription.endTime * 1000;
				}
			}
			/**
			 * Getting prediction cards
			 * Получение карт предсказаний
			 */
			if (call.ident == callsIdent['questFarm']) {
				const consumable = call.result.response?.consumable;
				if (consumable && consumable[81]) {
					countPredictionCard += consumable[81];
					console.log(`Cards: ${countPredictionCard}`);
				}
			}
			/**
+			 * Hiding extra servers
+			 * Скрытие лишних серверов
+			 */
			if (call.ident == callsIdent['serverGetAll'] && isChecked('hideServers')) {
				let servers = call.result.response.users.map(s => s.serverId)
				call.result.response.servers = call.result.response.servers.filter(s => servers.includes(s.id));
				isChange = true;
			}
			/**
			 * Displays player positions in the adventure
			 * Отображает позиции игроков в приключении
			 */
			if (call.ident == callsIdent['adventure_getLobbyInfo']) {
				const users = Object.values(call.result.response.users);
				let msg = I18N('PLAYER_POS');
				for (const user of users) {
					msg += `<br>${user.user.name} - ${user.currentNode}`;
				}
				setProgress(msg, false, hideProgress);
			}
			/**
			 * Automatic launch of a raid at the end of the adventure
			 * Автоматический запуск рейда при окончании приключения
			 */
			if (call.ident == callsIdent['adventure_end']) {
				autoRaidAdventure()
			}
		}

		if (mainReward && artifactChestOpen) {
			console.log(allReward);
			mainReward[artifactChestOpenCallName == 'artifactChestOpen' ? 'chestReward' : 'reward'] = [allReward];
			artifactChestOpen = false;
			artifactChestOpenCallName = '';
			isChange = true;
		}
	} catch(err) {
		console.log("Request(response, " + this.uniqid + "):\n", "Error:\n", response, err);
	}

	if (isChange) {
		Object.defineProperty(this, 'responseText', {
			writable: true
		});
		this.responseText = JSON.stringify(respond);
	}
}

/** Добавляет в бой эффекты усиления*/
    function addBuff(battle) {
        let effects = battle.effects;
        let buffType = getInput('needResource2');
        if (-1 < buffType && buffType < 7) {
            let percentBuff = getInput('needResource');
            effects.defenders = {};
            effects.defenders[buffs[buffType]] = percentBuff;
        } else if (buffType.slice(0, 1) == "-" || isChecked('treningBattle')) {
            buffType = parseInt(buffType.slice(1), 10);
            effects.defenders = repleyBattle.effects;
            battle.defenders[0] = repleyBattle.defenders;
            let def = battle.defenders[0];
            if (buffType == 1) {
                for (let i in def) {
                    let state = def[i].state;
                    state.hp = state.maxHp;
                    state.energy = 0;
                    state.isDead = false;
                }
            } else if (buffType == 2 || isChecked('finishingBattle')) {
                for (let i in def) {
                    let state = def[i].state;
                    let rState = repleyBattle.state[i];
                    if (!!rState) {
                        state.hp = rState.hp;
                        state.energy = rState.energy;
                        state.isDead = rState.isDead;
                    } else {
                        state.hp = 0;
                        state.energy = 0;
                        state.isDead = true;
                    }
                }
            }
        }
    }
const buffs = ['percentBuffAll_allAttacks', 'percentBuffAll_armor', 'percentBuffAll_magicResist', 'percentBuffAll_physicalAttack', 'percentBuffAll_magicPower', 'percentDamageBuff_dot', 'percentBuffAll_healing', 'percentBuffAllForFallenAllies', 'percentBuffAll_energyIncrease', 'percentIncomeDamageReduce_any', 'percentIncomeDamageReduce_physical', 'percentIncomeDamageReduce_magic', 'percentIncomeDamageReduce_dot', 'percentBuffHp', 'percentBuffByPerk_energyIncrease_8', 'percentBuffByPerk_energyIncrease_5', 'percentBuffByPerk_energyIncrease_4', 'percentBuffByPerk_allAttacks_5', 'percentBuffByPerk_allAttacks_4', 'percentBuffByPerk_allAttacks_9', 'percentBuffByPerk_castSpeed_7', 'percentBuffByPerk_castSpeed_6', 'percentBuffByPerk_castSpeed_10', 'percentBuffByPerk_armorPenetration_6', 'percentBuffByPerk_physicalAttack_6', 'percentBuffByPerk_armorPenetration_10', 'percentBuffByPerk_physicalAttack_10', 'percentBuffByPerk_magicPower_7', 'percentDamageBuff_any','percentDamageBuff_physical','percentDamageBuff_magic','corruptedBoss_25_80_1_100_10','tutorialPetUlt_1.2','tutorialBossPercentDamage_1','corruptedBoss_50_80_1_100_10','corruptedBoss_75_80_1_100_10','corruptedBoss_80_80_1_100_10','percentBuffByPerk_castSpeed_4','percentBuffByPerk_energyIncrease_7','percentBuffByPerk_castSpeed_9','percentBuffByPerk_castSpeed_8','bossStageBuff_1000000_20000','bossStageBuff_1500000_30000','bossStageBuff_2000000_40000','bossStageBuff_3000000_50000','bossStageBuff_4000000_60000','bossStageBuff_5000000_70000','bossStageBuff_7500000_80000','bossStageBuff_11000000_90000','bossStageBuff_15000000_100000','bossStageBuff_20000000_120000','bossStageBuff_30000000_150000','bossStageBuff_40000000_200000','bossStageBuff_50000000_250000','percentBuffPet_strength','percentBuffPet_castSpeed','percentBuffPet_petEnergyIncrease','stormPowerBuff_100_1000','stormPowerBuff_100','changeStarSphereIncomingDamage_any','changeBlackHoleDamage','buffSpeedWhenStarfall','changeTeamStartEnergy','decreaseStarSphereDamage','avoidAllBlackholeDamageOnce','groveKeeperAvoidBlackholeDamageChance_3','undeadPreventsNightmares_3','engeneerIncreaseStarMachineIncomingDamage_3','overloadHealDamageStarSphere','nightmareDeathGiveLifesteal_100','starfallIncreaseAllyHeal_9_100','decreaseStarSphereDamage_4','increaseNightmaresIncomingDamageByCount','debuffNightmareOnSpawnFrom_7_hp','damageNightmareGiveEnergy','ultEnergyCompensationOnPlanetParade_6','bestDamagerBeforeParadeGetsImprovedBuff_any','starSphereDeathGiveEnergy','bestDamagerOnParadeBecomesImmortal_any','preventNightmare','buffStatWithHealing_physicalAttack_magic_100','buffStatWithHealing_magicPower_physical_100','buffStatWithHealing_hp_dot_100','replaceHealingWithDamage_magic','critWithRetaliation_10_dot','posessionWithBuffStat_25_20_5_10','energyBurnDamageWithEffect_magic_Silence_5_5','percentBuffHp','percentBuffAll_energyIncrease','percentBuffAll_magicResist','percentBuffAll_armor','percentIncomeDamageReduce_any','percentBuffAll_healing','percentIncomeDamageReduce_any','percentBuffHp','percentBuffAll_energyIncrease','percentIncomeDamageReduce_any','percentBuffHp','percentBuffByPerk_castSpeed_All','percentBuffAll_castSpeed'];

/**
 * Request an answer to a question
 *
 * Запрос ответа на вопрос
 */
async function getAnswer(question) {
	return new Promise((resolve, reject) => {
		fetch('https://zingery.ru/heroes/getAnswer.php', {
			method: 'POST',
			body: JSON.stringify(question)
		}).then(
			response => response.json()
		).then(
			data => {
				if (data.result) {
					resolve(data.result);
				} else {
					resolve(false);
				}
			}
		).catch((error) => {
			console.error(error);
			resolve(false);
		});
	})
}

/**
 * Submitting a question and answer to a database
 *
 * Отправка вопроса и ответа в базу данных
 */
function sendAnswerInfo(answerInfo) {
	fetch('https://zingery.ru/heroes/setAnswer.php', {
		method: 'POST',
		body: JSON.stringify(answerInfo)
	}).then(
		response => response.json()
	).then(
		data => {
			if (data.result) {
				console.log(I18N('SENT_QUESTION'));
			}
		}
	)
}

/**
 * Returns the battle type by preset type
 *
 * Возвращает тип боя по типу пресета
 */
function getBattleType(strBattleType) {
	if (strBattleType.includes("invasion")) {
		return "get_invasion";
	}
	if (strBattleType.includes("boss")) {
		return "get_boss";
	}
	switch (strBattleType) {
		case "invasion":
			return "get_invasion";
		case "titan_pvp_manual":
			return "get_titanPvpManual";
		case "titan_pvp":
			return "get_titanPvp";
		case "titan_clan_pvp":
		case "clan_pvp_titan":
		case "clan_global_pvp_titan":
		case "brawl_titan":
		case "challenge_titan":
			return "get_titanClanPvp";
		case "clan_raid": // Asgard Boss // Босс асгарда
		case "adventure": // Adventures // Приключения
		case "clan_global_pvp":
		case "clan_pvp":
		case "challenge":
			return "get_clanPvp";
		case "dungeon_titan":
		case "titan_tower":
			return "get_titan";
		case "tower":
		case "clan_dungeon":
			return "get_tower";
		case "pve":
			return "get_pve";
		case "pvp_manual":
			return "get_pvpManual";
		case "grand":
		case "arena":
		case "pvp":
			return "get_pvp";
		case "core":
			return "get_core";
		case "boss_10":
		case "boss_11":
		case "boss_12":
			return "get_boss";
		default:
			return "get_clanPvp";
	}
}
/**
 * Returns the class name of the passed object
 *
 * Возвращает название класса переданного объекта
 */
function getClass(obj) {
	return {}.toString.call(obj).slice(8, -1);
}
/**
 * Calculates the request signature
 *
 * Расчитывает сигнатуру запроса
 */
this.getSignature = function(headers, data) {
	const sign = {
		signature: '',
		length: 0,
		add: function (text) {
			this.signature += text;
			if (this.length < this.signature.length) {
				this.length = 3 * (this.signature.length + 1) >> 1;
			}
		},
	}
	sign.add(headers["X-Request-Id"]);
	sign.add(':');
	sign.add(headers["X-Auth-Token"]);
	sign.add(':');
	sign.add(headers["X-Auth-Session-Id"]);
	sign.add(':');
	sign.add(data);
	sign.add(':');
	sign.add('LIBRARY-VERSION=1');
	sign.add('UNIQUE-SESSION-ID=' + headers["X-Env-Unique-Session-Id"]);

	return md5(sign.signature);
}
/**
 * Creates an interface
 *
 * Создает интерфейс
 */
function createInterface() {
	scriptMenu.init({
		showMenu: true
	});
	scriptMenu.addHeader(GM_info.script.name, justInfo);
	scriptMenu.addHeader('v' + GM_info.script.version);
}

function addControls() {
	const checkboxDetails = scriptMenu.addDetails(I18N('SETTINGS'));
	for (let name in checkboxes) {
		checkboxes[name].cbox = scriptMenu.addCheckbox(checkboxes[name].label, checkboxes[name].title, checkboxDetails);
		/**
		 * Getting the state of checkboxes from storage
		 * Получаем состояние чекбоксов из storage
		 */
		let val = storage.get(name, null);
		if (val != null) {
			checkboxes[name].cbox.checked = val;
		} else {
			storage.set(name, checkboxes[name].default);
			checkboxes[name].cbox.checked = checkboxes[name].default;
		}
		/**
		 * Tracing the change event of the checkbox for writing to storage
		 * Отсеживание события изменения чекбокса для записи в storage
		 */
		checkboxes[name].cbox.dataset['name'] = name;
		checkboxes[name].cbox.addEventListener('change', async function (event) {
			const nameCheckbox = this.dataset['name'];
			/*
			if (this.checked && nameCheckbox == 'cancelBattle') {
				this.checked = false;
				if (await popup.confirm(I18N('MSG_BAN_ATTENTION'), [
					{ msg: I18N('BTN_NO_I_AM_AGAINST'), result: true },
					{ msg: I18N('BTN_YES_I_AGREE'), result: false },
				])) {
					return;
				}
				this.checked = true;
			}
			*/
			storage.set(nameCheckbox, this.checked);
		})
	}

	const inputDetails = scriptMenu.addDetails(I18N('VALUES'));
	for (let name in inputs) {
		inputs[name].input = scriptMenu.addInputText(inputs[name].title, false, inputDetails);
		/**
		 * Get inputText state from storage
		 * Получаем состояние inputText из storage
		 */
		let val = storage.get(name, null);
		if (val != null) {
			inputs[name].input.value = val;
		} else {
			storage.set(name, inputs[name].default);
			inputs[name].input.value = inputs[name].default;
		}
		/**
		 * Tracing a field change event for a record in storage
		 * Отсеживание события изменения поля для записи в storage
		 */
		inputs[name].input.dataset['name'] = name;
		inputs[name].input.addEventListener('input', function () {
			const inputName = this.dataset['name'];
			let value = +this.value;
			if (!value || Number.isNaN(value)) {
				value = storage.get(inputName, inputs[inputName].default);
				inputs[name].input.value = value;
			}
			storage.set(inputName, value);
		})
	}
	const inputDetails2 = scriptMenu.addDetails(I18N('SAVING'));
	for (let name in inputs2) {
		inputs2[name].input = scriptMenu.addInputText(inputs2[name].title, false, inputDetails2);
		/**
		 * Get inputText state from storage
		 * Получаем состояние inputText из storage
		 */
		let val = storage.get(name, null);
		if (val != null) {
			inputs2[name].input.value = val;
		} else {
			storage.set(name, inputs2[name].default);
			inputs2[name].input.value = inputs2[name].default;
		}
		/**
		 * Tracing a field change event for a record in storage
		 * Отсеживание события изменения поля для записи в storage
		 */
		inputs2[name].input.dataset['name'] = name;
		inputs2[name].input.addEventListener('input', function () {
			const inputName = this.dataset['name'];
			let value = +this.value;
			if (!value || Number.isNaN(value)) {
				value = storage.get(inputName, inputs2[inputName].default);
				inputs2[name].input.value = value;
			}
			storage.set(inputName, value);
		})
	}
	const inputDetails3 = scriptMenu.addDetails(I18N('USER_ID'));
	for (let name in inputs3) {
		inputs3[name].input = scriptMenu.addInputText(inputs3[name].title, false, inputDetails3);
		/**
		 * Get inputText state from storage
		 * Получаем состояние inputText из storage
		 */
		let val = storage.get(name, null);
		if (val != null) {
			inputs3[name].input.value = val;
		} else {
			storage.set(name, inputs3[name].default);
			inputs3[name].input.value = inputs3[name].default;
		}
		/**
		 * Tracing a field change event for a record in storage
		 * Отсеживание события изменения поля для записи в storage
		 */
		inputs3[name].input.dataset['name'] = name;
		inputs3[name].input.addEventListener('input', function () {
			const inputName = this.dataset['name'];
			let value = +this.value;
			if (!value || Number.isNaN(value)) {
				value = storage.get(inputName, inputs3[inputName].default);
				inputs3[name].input.value = value;
			}
			storage.set(inputName, value);
		})
	}
}

/**
 * Sending a request
 *
 * Отправка запроса
 */
function send(json, callback, pr) {
	if (typeof json == 'string') {
		json = JSON.parse(json);
	}
	for (const call of json.calls) {
		if (!call?.context?.actionTs) {
			call.context = {
				actionTs: performance.now()
			}
		}
	}
	json = JSON.stringify(json);
	/**
	 * We get the headlines of the previous intercepted request
	 * Получаем заголовки предыдущего перехваченого запроса
	 */
	let headers = lastHeaders;
	/**
	 * We increase the header of the query Certifier by 1
	 * Увеличиваем заголовок идетификатора запроса на 1
	 */
	headers["X-Request-Id"]++;
	/**
	 * We calculate the title with the signature
	 * Расчитываем заголовок с сигнатурой
	 */
	headers["X-Auth-Signature"] = getSignature(headers, json);
	/**
	 * Create a new ajax request
	 * Создаем новый AJAX запрос
	 */
	let xhr = new XMLHttpRequest;
	/**
	 * Indicate the previously saved URL for API queries
	 * Указываем ранее сохраненный URL для API запросов
	 */
	xhr.open('POST', apiUrl, true);
	/**
	 * Add the function to the event change event
	 * Добавляем функцию к событию смены статуса запроса
	 */
	xhr.onreadystatechange = function() {
		/**
		 * If the result of the request is obtained, we call the flask function
		 * Если результат запроса получен вызываем колбек функцию
		 */
		if(xhr.readyState == 4) {
			let randTimeout = Math.random() * 200 + 200;
			setTimeout(callback, randTimeout, xhr.response, pr);
		}
	};
	/**
	 * Indicate the type of request
	 * Указываем тип запроса
	 */
	xhr.responseType = 'json';
	/**
	 * We set the request headers
	 * Задаем заголовки запроса
	 */
	for(let nameHeader in headers) {
		let head = headers[nameHeader];
		xhr.setRequestHeader(nameHeader, head);
	}
	/**
	 * Sending a request
	 * Отправляем запрос
	 */
	xhr.send(json);
}

let hideTimeoutProgress = 0;
/**
 * Hide progress
 *
 * Скрыть прогресс
 */
function hideProgress(timeout) {
	timeout = timeout || 0;
	clearTimeout(hideTimeoutProgress);
	hideTimeoutProgress = setTimeout(function () {
		scriptMenu.setStatus('');
	}, timeout);
}
/**
 * Progress display
 *
 * Отображение прогресса
 */
function setProgress(text, hide, onclick) {
	scriptMenu.setStatus(text, onclick);
	hide = hide || false;
	if (hide) {
		hideProgress(3000);
	}
}

/**
 * Returns the timer value depending on the subscription
 *
 * Возвращает значение таймера в зависимости от подписки
 */
function getTimer(time) {
	let speedDiv = 5;
	if (subEndTime < Date.now()) {
		speedDiv = 1.5;
	}
	return Math.max(time / speedDiv + 1.5, 4);
}


/**
 * Calculates HASH MD5 from string
 *
 * Расчитывает HASH MD5 из строки
 *
 * [js-md5]{@link https://github.com/emn178/js-md5}
 *
 * @namespace md5
 * @version 0.7.3
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
!function(){"use strict";function t(t){if(t)d[0]=d[16]=d[1]=d[2]=d[3]=d[4]=d[5]=d[6]=d[7]=d[8]=d[9]=d[10]=d[11]=d[12]=d[13]=d[14]=d[15]=0,this.blocks=d,this.buffer8=l;else if(a){var r=new ArrayBuffer(68);this.buffer8=new Uint8Array(r),this.blocks=new Uint32Array(r)}else this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.h0=this.h1=this.h2=this.h3=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0}var r="input is invalid type",e="object"==typeof window,i=e?window:{};i.JS_MD5_NO_WINDOW&&(e=!1);var s=!e&&"object"==typeof self,h=!i.JS_MD5_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;h?i=global:s&&(i=self);var f=!i.JS_MD5_NO_COMMON_JS&&"object"==typeof module&&module.exports,o="function"==typeof define&&define.amd,a=!i.JS_MD5_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,n="0123456789abcdef".split(""),u=[128,32768,8388608,-2147483648],y=[0,8,16,24],c=["hex","array","digest","buffer","arrayBuffer","base64"],p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),d=[],l;if(a){var A=new ArrayBuffer(68);l=new Uint8Array(A),d=new Uint32Array(A)}!i.JS_MD5_NO_NODE_JS&&Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),!a||!i.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW&&ArrayBuffer.isView||(ArrayBuffer.isView=function(t){return"object"==typeof t&&t.buffer&&t.buffer.constructor===ArrayBuffer});var b=function(r){return function(e){return new t(!0).update(e)[r]()}},v=function(){var r=b("hex");h&&(r=w(r)),r.create=function(){return new t},r.update=function(t){return r.create().update(t)};for(var e=0;e<c.length;++e){var i=c[e];r[i]=b(i)}return r},w=function(t){var e=eval("require('crypto')"),i=eval("require('buffer').Buffer"),s=function(s){if("string"==typeof s)return e.createHash("md5").update(s,"utf8").digest("hex");if(null===s||void 0===s)throw r;return s.constructor===ArrayBuffer&&(s=new Uint8Array(s)),Array.isArray(s)||ArrayBuffer.isView(s)||s.constructor===i?e.createHash("md5").update(new i(s)).digest("hex"):t(s)};return s};t.prototype.update=function(t){if(!this.finalized){var e,i=typeof t;if("string"!==i){if("object"!==i)throw r;if(null===t)throw r;if(a&&t.constructor===ArrayBuffer)t=new Uint8Array(t);else if(!(Array.isArray(t)||a&&ArrayBuffer.isView(t)))throw r;e=!0}for(var s,h,f=0,o=t.length,n=this.blocks,u=this.buffer8;f<o;){if(this.hashed&&(this.hashed=!1,n[0]=n[16],n[16]=n[1]=n[2]=n[3]=n[4]=n[5]=n[6]=n[7]=n[8]=n[9]=n[10]=n[11]=n[12]=n[13]=n[14]=n[15]=0),e)if(a)for(h=this.start;f<o&&h<64;++f)u[h++]=t[f];else for(h=this.start;f<o&&h<64;++f)n[h>>2]|=t[f]<<y[3&h++];else if(a)for(h=this.start;f<o&&h<64;++f)(s=t.charCodeAt(f))<128?u[h++]=s:s<2048?(u[h++]=192|s>>6,u[h++]=128|63&s):s<55296||s>=57344?(u[h++]=224|s>>12,u[h++]=128|s>>6&63,u[h++]=128|63&s):(s=65536+((1023&s)<<10|1023&t.charCodeAt(++f)),u[h++]=240|s>>18,u[h++]=128|s>>12&63,u[h++]=128|s>>6&63,u[h++]=128|63&s);else for(h=this.start;f<o&&h<64;++f)(s=t.charCodeAt(f))<128?n[h>>2]|=s<<y[3&h++]:s<2048?(n[h>>2]|=(192|s>>6)<<y[3&h++],n[h>>2]|=(128|63&s)<<y[3&h++]):s<55296||s>=57344?(n[h>>2]|=(224|s>>12)<<y[3&h++],n[h>>2]|=(128|s>>6&63)<<y[3&h++],n[h>>2]|=(128|63&s)<<y[3&h++]):(s=65536+((1023&s)<<10|1023&t.charCodeAt(++f)),n[h>>2]|=(240|s>>18)<<y[3&h++],n[h>>2]|=(128|s>>12&63)<<y[3&h++],n[h>>2]|=(128|s>>6&63)<<y[3&h++],n[h>>2]|=(128|63&s)<<y[3&h++]);this.lastByteIndex=h,this.bytes+=h-this.start,h>=64?(this.start=h-64,this.hash(),this.hashed=!0):this.start=h}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},t.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,r=this.lastByteIndex;t[r>>2]|=u[3&r],r>=56&&(this.hashed||this.hash(),t[0]=t[16],t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.bytes<<3,t[15]=this.hBytes<<3|this.bytes>>>29,this.hash()}},t.prototype.hash=function(){var t,r,e,i,s,h,f=this.blocks;this.first?r=((r=((t=((t=f[0]-680876937)<<7|t>>>25)-271733879<<0)^(e=((e=(-271733879^(i=((i=(-1732584194^2004318071&t)+f[1]-117830708)<<12|i>>>20)+t<<0)&(-271733879^t))+f[2]-1126478375)<<17|e>>>15)+i<<0)&(i^t))+f[3]-1316259209)<<22|r>>>10)+e<<0:(t=this.h0,r=this.h1,e=this.h2,r=((r+=((t=((t+=((i=this.h3)^r&(e^i))+f[0]-680876936)<<7|t>>>25)+r<<0)^(e=((e+=(r^(i=((i+=(e^t&(r^e))+f[1]-389564586)<<12|i>>>20)+t<<0)&(t^r))+f[2]+606105819)<<17|e>>>15)+i<<0)&(i^t))+f[3]-1044525330)<<22|r>>>10)+e<<0),r=((r+=((t=((t+=(i^r&(e^i))+f[4]-176418897)<<7|t>>>25)+r<<0)^(e=((e+=(r^(i=((i+=(e^t&(r^e))+f[5]+1200080426)<<12|i>>>20)+t<<0)&(t^r))+f[6]-1473231341)<<17|e>>>15)+i<<0)&(i^t))+f[7]-45705983)<<22|r>>>10)+e<<0,r=((r+=((t=((t+=(i^r&(e^i))+f[8]+1770035416)<<7|t>>>25)+r<<0)^(e=((e+=(r^(i=((i+=(e^t&(r^e))+f[9]-1958414417)<<12|i>>>20)+t<<0)&(t^r))+f[10]-42063)<<17|e>>>15)+i<<0)&(i^t))+f[11]-1990404162)<<22|r>>>10)+e<<0,r=((r+=((t=((t+=(i^r&(e^i))+f[12]+1804603682)<<7|t>>>25)+r<<0)^(e=((e+=(r^(i=((i+=(e^t&(r^e))+f[13]-40341101)<<12|i>>>20)+t<<0)&(t^r))+f[14]-1502002290)<<17|e>>>15)+i<<0)&(i^t))+f[15]+1236535329)<<22|r>>>10)+e<<0,r=((r+=((i=((i+=(r^e&((t=((t+=(e^i&(r^e))+f[1]-165796510)<<5|t>>>27)+r<<0)^r))+f[6]-1069501632)<<9|i>>>23)+t<<0)^t&((e=((e+=(t^r&(i^t))+f[11]+643717713)<<14|e>>>18)+i<<0)^i))+f[0]-373897302)<<20|r>>>12)+e<<0,r=((r+=((i=((i+=(r^e&((t=((t+=(e^i&(r^e))+f[5]-701558691)<<5|t>>>27)+r<<0)^r))+f[10]+38016083)<<9|i>>>23)+t<<0)^t&((e=((e+=(t^r&(i^t))+f[15]-660478335)<<14|e>>>18)+i<<0)^i))+f[4]-405537848)<<20|r>>>12)+e<<0,r=((r+=((i=((i+=(r^e&((t=((t+=(e^i&(r^e))+f[9]+568446438)<<5|t>>>27)+r<<0)^r))+f[14]-1019803690)<<9|i>>>23)+t<<0)^t&((e=((e+=(t^r&(i^t))+f[3]-187363961)<<14|e>>>18)+i<<0)^i))+f[8]+1163531501)<<20|r>>>12)+e<<0,r=((r+=((i=((i+=(r^e&((t=((t+=(e^i&(r^e))+f[13]-1444681467)<<5|t>>>27)+r<<0)^r))+f[2]-51403784)<<9|i>>>23)+t<<0)^t&((e=((e+=(t^r&(i^t))+f[7]+1735328473)<<14|e>>>18)+i<<0)^i))+f[12]-1926607734)<<20|r>>>12)+e<<0,r=((r+=((h=(i=((i+=((s=r^e)^(t=((t+=(s^i)+f[5]-378558)<<4|t>>>28)+r<<0))+f[8]-2022574463)<<11|i>>>21)+t<<0)^t)^(e=((e+=(h^r)+f[11]+1839030562)<<16|e>>>16)+i<<0))+f[14]-35309556)<<23|r>>>9)+e<<0,r=((r+=((h=(i=((i+=((s=r^e)^(t=((t+=(s^i)+f[1]-1530992060)<<4|t>>>28)+r<<0))+f[4]+1272893353)<<11|i>>>21)+t<<0)^t)^(e=((e+=(h^r)+f[7]-155497632)<<16|e>>>16)+i<<0))+f[10]-1094730640)<<23|r>>>9)+e<<0,r=((r+=((h=(i=((i+=((s=r^e)^(t=((t+=(s^i)+f[13]+681279174)<<4|t>>>28)+r<<0))+f[0]-358537222)<<11|i>>>21)+t<<0)^t)^(e=((e+=(h^r)+f[3]-722521979)<<16|e>>>16)+i<<0))+f[6]+76029189)<<23|r>>>9)+e<<0,r=((r+=((h=(i=((i+=((s=r^e)^(t=((t+=(s^i)+f[9]-640364487)<<4|t>>>28)+r<<0))+f[12]-421815835)<<11|i>>>21)+t<<0)^t)^(e=((e+=(h^r)+f[15]+530742520)<<16|e>>>16)+i<<0))+f[2]-995338651)<<23|r>>>9)+e<<0,r=((r+=((i=((i+=(r^((t=((t+=(e^(r|~i))+f[0]-198630844)<<6|t>>>26)+r<<0)|~e))+f[7]+1126891415)<<10|i>>>22)+t<<0)^((e=((e+=(t^(i|~r))+f[14]-1416354905)<<15|e>>>17)+i<<0)|~t))+f[5]-57434055)<<21|r>>>11)+e<<0,r=((r+=((i=((i+=(r^((t=((t+=(e^(r|~i))+f[12]+1700485571)<<6|t>>>26)+r<<0)|~e))+f[3]-1894986606)<<10|i>>>22)+t<<0)^((e=((e+=(t^(i|~r))+f[10]-1051523)<<15|e>>>17)+i<<0)|~t))+f[1]-2054922799)<<21|r>>>11)+e<<0,r=((r+=((i=((i+=(r^((t=((t+=(e^(r|~i))+f[8]+1873313359)<<6|t>>>26)+r<<0)|~e))+f[15]-30611744)<<10|i>>>22)+t<<0)^((e=((e+=(t^(i|~r))+f[6]-1560198380)<<15|e>>>17)+i<<0)|~t))+f[13]+1309151649)<<21|r>>>11)+e<<0,r=((r+=((i=((i+=(r^((t=((t+=(e^(r|~i))+f[4]-145523070)<<6|t>>>26)+r<<0)|~e))+f[11]-1120210379)<<10|i>>>22)+t<<0)^((e=((e+=(t^(i|~r))+f[2]+718787259)<<15|e>>>17)+i<<0)|~t))+f[9]-343485551)<<21|r>>>11)+e<<0,this.first?(this.h0=t+1732584193<<0,this.h1=r-271733879<<0,this.h2=e-1732584194<<0,this.h3=i+271733878<<0,this.first=!1):(this.h0=this.h0+t<<0,this.h1=this.h1+r<<0,this.h2=this.h2+e<<0,this.h3=this.h3+i<<0)},t.prototype.hex=function(){this.finalize();var t=this.h0,r=this.h1,e=this.h2,i=this.h3;return n[t>>4&15]+n[15&t]+n[t>>12&15]+n[t>>8&15]+n[t>>20&15]+n[t>>16&15]+n[t>>28&15]+n[t>>24&15]+n[r>>4&15]+n[15&r]+n[r>>12&15]+n[r>>8&15]+n[r>>20&15]+n[r>>16&15]+n[r>>28&15]+n[r>>24&15]+n[e>>4&15]+n[15&e]+n[e>>12&15]+n[e>>8&15]+n[e>>20&15]+n[e>>16&15]+n[e>>28&15]+n[e>>24&15]+n[i>>4&15]+n[15&i]+n[i>>12&15]+n[i>>8&15]+n[i>>20&15]+n[i>>16&15]+n[i>>28&15]+n[i>>24&15]},t.prototype.toString=t.prototype.hex,t.prototype.digest=function(){this.finalize();var t=this.h0,r=this.h1,e=this.h2,i=this.h3;return[255&t,t>>8&255,t>>16&255,t>>24&255,255&r,r>>8&255,r>>16&255,r>>24&255,255&e,e>>8&255,e>>16&255,e>>24&255,255&i,i>>8&255,i>>16&255,i>>24&255]},t.prototype.array=t.prototype.digest,t.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(16),r=new Uint32Array(t);return r[0]=this.h0,r[1]=this.h1,r[2]=this.h2,r[3]=this.h3,t},t.prototype.buffer=t.prototype.arrayBuffer,t.prototype.base64=function(){for(var t,r,e,i="",s=this.array(),h=0;h<15;)t=s[h++],r=s[h++],e=s[h++],i+=p[t>>>2]+p[63&(t<<4|r>>>4)]+p[63&(r<<2|e>>>6)]+p[63&e];return t=s[h],i+=p[t>>>2]+p[t<<4&63]+"=="};var _=v();f?module.exports=_:(i.md5=_,o&&define(function(){return _}))}();

/**
 * Script for beautiful dialog boxes
 *
 * Скрипт для красивых диалоговых окошек
 */
const popup = new (function () {
	this.popUp,
	this.downer,
	this.middle,
	this.msgText,
	this.buttons = [];
	this.checkboxes = [];
    this.dialogPromice = null;

	function init() {
		addStyle();
		addBlocks();
		addEventListeners();
	}

	const addEventListeners = () => {
		document.addEventListener('keyup', (e) => {
			if (e.key == 'Escape') {
				if (this.dialogPromice) {
					const { func, result } = this.dialogPromice;
					this.dialogPromice = null;
					popup.hide();
					func(result);
				}
			}
		});
	}

	const addStyle = () => {
		let style = document.createElement('style');
		style.innerText = `
	.PopUp_ {
		position: absolute;
		min-width: 300px;
		max-width: 500px;
		max-height: 600px;
		background-color: #190e08e6;
		z-index: 10001;
		top: 169px;
		left: 345px;
		border: 3px #ce9767 solid;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 15px 12px;
	}

	.PopUp_back {
		position: absolute;
		background-color: #00000066;
		width: 100%;
		height: 100%;
		z-index: 10000;
		top: 0;
		left: 0;
	}

	.PopUp_close {
		width: 40px;
		height: 40px;
		position: absolute;
		right: -18px;
		top: -18px;
		border: 3px solid #c18550;
		border-radius: 20px;
		background: radial-gradient(circle, rgba(190,30,35,1) 0%, rgba(0,0,0,1) 100%);
		background-position-y: 3px;
		box-shadow: -1px 1px 3px black;
		cursor: pointer;
		box-sizing: border-box;
	}

	.PopUp_close:hover {
		filter: brightness(1.2);
	}

	.PopUp_crossClose {
		width: 100%;
		height: 100%;
		background-size: 65%;
		background-position: center;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%23f4cd73' d='M 0.826 12.559 C 0.431 12.963 3.346 15.374 3.74 14.97 C 4.215 15.173 8.167 10.457 7.804 10.302 C 7.893 10.376 11.454 14.64 11.525 14.372 C 12.134 15.042 15.118 12.086 14.638 11.689 C 14.416 11.21 10.263 7.477 10.402 7.832 C 10.358 7.815 11.731 7.101 14.872 3.114 C 14.698 2.145 13.024 1.074 12.093 1.019 C 11.438 0.861 8.014 5.259 8.035 5.531 C 7.86 5.082 3.61 1.186 3.522 1.59 C 2.973 1.027 0.916 4.611 1.17 4.873 C 0.728 4.914 5.088 7.961 5.61 7.995 C 5.225 7.532 0.622 12.315 0.826 12.559 Z'/%3e%3c/svg%3e")
	}

	.PopUp_blocks {
		width: 100%;
		height: 50%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
	}

	.PopUp_blocks:last-child {
		margin-top: 25px;
	}

	.PopUp_buttons {
		display: flex;
		margin: 10px 12px;
		flex-direction: column;
	}

	.PopUp_button {
		background-color: #52A81C;
		border-radius: 5px;
		box-shadow: inset 0px -4px 10px, inset 0px 3px 2px #99fe20, 0px 0px 4px, 0px -3px 1px #d7b275, 0px 0px 0px 3px #ce9767;
		cursor: pointer;
		padding: 5px 15px 7px;
	}

	.PopUp_input {
		text-align: center;
		font-size: 16px;
		height: 27px;
		border: 1px solid #cf9250;
		border-radius: 9px 9px 0px 0px;
		background: transparent;
		color: #fce1ac;
		padding: 1px 10px;
		box-sizing: border-box;
		box-shadow: 0px 0px 4px, 0px 0px 0px 3px #ce9767;
	}

	.PopUp_checkboxes {
		display: flex;
		flex-direction: column;
		margin: 15px 15px -5px 15px;
		align-items: flex-start;
	}

	.PopUp_ContCheckbox {
		margin: 2px 0px;
	}

	.PopUp_checkbox {
		position: absolute;
		z-index: -1;
		opacity: 0;
	}
	.PopUp_checkbox+label {
		display: inline-flex;
		align-items: center;
		user-select: none;

		font-size: 15px;
		font-family: sans-serif;
		font-weight: 600;
		font-stretch: condensed;
		letter-spacing: 1px;
		color: #fce1ac;
		text-shadow: 0px 0px 1px;
	}
	.PopUp_checkbox+label::before {
		content: '';
		display: inline-block;
		width: 20px;
		height: 20px;
		border: 1px solid #cf9250;
		border-radius: 7px;
		margin-right: 7px;
	}
	.PopUp_checkbox:checked+label::before {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2388cb13' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
	}

	.PopUp_input::placeholder {
		color: #fce1ac75;
	}

	.PopUp_input:focus {
		outline: 0;
	}

	.PopUp_input + .PopUp_button {
		border-radius: 0px 0px 5px 5px;
		padding: 2px 18px 5px;
	}

	.PopUp_button:hover {
		filter: brightness(1.2);
	}

	.PopUp_text {
		font-size: 22px;
		font-family: sans-serif;
		font-weight: 600;
		font-stretch: condensed;
		white-space: pre-wrap;
		letter-spacing: 1px;
		text-align: center;
	}

	.PopUp_buttonText {
		color: #E4FF4C;
		text-shadow: 0px 1px 2px black;
	}

	.PopUp_msgText {
		color: #FDE5B6;
		text-shadow: 0px 0px 2px;
	}

	.PopUp_hideBlock {
		display: none;
	}
	`;
		document.head.appendChild(style);
	}

	const addBlocks = () => {
		this.back = document.createElement('div');
		this.back.classList.add('PopUp_back');
		this.back.classList.add('PopUp_hideBlock');
		document.body.append(this.back);

		this.popUp = document.createElement('div');
		this.popUp.classList.add('PopUp_');
		this.back.append(this.popUp);

		let upper = document.createElement('div')
		upper.classList.add('PopUp_blocks');
		this.popUp.append(upper);

		this.middle = document.createElement('div')
		this.middle.classList.add('PopUp_blocks');
		this.middle.classList.add('PopUp_checkboxes');
		this.popUp.append(this.middle);

		this.downer = document.createElement('div')
		this.downer.classList.add('PopUp_blocks');
		this.popUp.append(this.downer);

		this.msgText = document.createElement('div');
		this.msgText.classList.add('PopUp_text', 'PopUp_msgText');
		upper.append(this.msgText);
	}

	this.showBack = function () {
		this.back.classList.remove('PopUp_hideBlock');
	}

	this.hideBack = function () {
		this.back.classList.add('PopUp_hideBlock');
	}

	this.show = function () {
		if (this.checkboxes.length) {
			this.middle.classList.remove('PopUp_hideBlock');
		}
		this.showBack();
		this.popUp.classList.remove('PopUp_hideBlock');
		this.popUp.style.left = (window.innerWidth - this.popUp.offsetWidth) / 2 + 'px';
		this.popUp.style.top = (window.innerHeight - this.popUp.offsetHeight) / 3 + 'px';
	}

	this.hide = function () {
		this.hideBack();
		this.popUp.classList.add('PopUp_hideBlock');
	}

	this.addAnyButton = (option) => {
		const contButton = document.createElement('div');
		contButton.classList.add('PopUp_buttons');
		this.downer.append(contButton);

		let inputField = {
			value: option.result || option.default
		}
		if (option.isInput) {
			inputField = document.createElement('input');
			inputField.type = 'text';
			if (option.placeholder) {
				inputField.placeholder = option.placeholder;
			}
			if (option.default) {
				inputField.value = option.default;
			}
			inputField.classList.add('PopUp_input');
			contButton.append(inputField);
		}

		const button = document.createElement('div');
		button.classList.add('PopUp_button');
		button.title = option.title || '';
		contButton.append(button);

		const buttonText = document.createElement('div');
		buttonText.classList.add('PopUp_text', 'PopUp_buttonText');
		buttonText.innerText = option.msg;
		button.append(buttonText);

		return { button, contButton, inputField };
	}

	this.addCloseButton = () => {
		let button = document.createElement('div')
		button.classList.add('PopUp_close');
		this.popUp.append(button);

		let crossClose = document.createElement('div')
		crossClose.classList.add('PopUp_crossClose');
		button.append(crossClose);

		return { button, contButton: button };
	}

	this.addButton = (option, buttonClick) => {

		const { button, contButton, inputField } = option.isClose ? this.addCloseButton() : this.addAnyButton(option);
        if (option.isClose) {
			this.dialogPromice = {func: buttonClick, result: option.result};
		}
		button.addEventListener('click', () => {
			let result = '';
			if (option.isInput) {
				result = inputField.value;
			}
            if (option.isClose || option.isCancel) {
				this.dialogPromice = null;
			}
			buttonClick(result);
		});

		this.buttons.push(contButton);
	}

	this.clearButtons = () => {
		while (this.buttons.length) {
			this.buttons.pop().remove();
		}
	}

	this.addCheckBox = (checkBox) => {
		const contCheckbox = document.createElement('div');
		contCheckbox.classList.add('PopUp_ContCheckbox');
		this.middle.append(contCheckbox);

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = 'PopUpCheckbox' + this.checkboxes.length;
		checkbox.dataset.name = checkBox.name;
		checkbox.checked = checkBox.checked;
		checkbox.label = checkBox.label;
		checkbox.title = checkBox.title || '';
		checkbox.classList.add('PopUp_checkbox');
		contCheckbox.appendChild(checkbox)

		const checkboxLabel = document.createElement('label');
		checkboxLabel.innerText = checkBox.label;
		checkboxLabel.title = checkBox.title || '';
		checkboxLabel.setAttribute('for', checkbox.id);
		contCheckbox.appendChild(checkboxLabel);

		this.checkboxes.push(checkbox);
	}

	this.clearCheckBox = () => {
		this.middle.classList.add('PopUp_hideBlock');
		while (this.checkboxes.length) {
			this.checkboxes.pop().parentNode.remove();
		}
	}

	this.setMsgText = (text) => {
		this.msgText.innerHTML = text;
	}

	this.getCheckBoxes = () => {
		const checkBoxes = [];

		for (const checkBox of this.checkboxes) {
			checkBoxes.push({
				name: checkBox.dataset.name,
				label: checkBox.label,
				checked: checkBox.checked
			});
		}

		return checkBoxes;
	}

	this.confirm = async (msg, buttOpt, checkBoxes = []) => {
		this.clearButtons();
		this.clearCheckBox();
		return new Promise((complete, failed) => {
			this.setMsgText(msg);
			if (!buttOpt) {
				buttOpt = [{ msg: 'Ok', result: true, isInput: false }];
			}
			for (const checkBox of checkBoxes) {
				this.addCheckBox(checkBox);
			}
			for (let butt of buttOpt) {
				this.addButton(butt, (result) => {
					result = result || butt.result;
					complete(result);
					popup.hide();
				});
                if (butt.isCancel) {
					this.dialogPromice = {func: complete, result: butt.result};
				}
			}
			this.show();
		});
	}

	document.addEventListener('DOMContentLoaded', init);
});
/**
 * Script control panel
 *
 * Панель управления скриптом
 */
const scriptMenu = new (function () {

	this.mainMenu,
	this.buttons = [],
	this.checkboxes = [];
	this.option = {
		showMenu: false,
		showDetails: {}
	};

	this.init = function (option = {}) {
		this.option = Object.assign(this.option, option);
		this.option.showDetails = this.loadShowDetails();
		addStyle();
		addBlocks();
	}

	const addStyle = () => {
		style = document.createElement('style');
		style.innerText = `
	.scriptMenu_status {
		position: absolute;
		z-index: 10001;
		white-space: pre-wrap; //тест для выравнивания кнопок
		/* max-height: 30px; */
		top: -1px;
		left: 30%;
		cursor: pointer;
		border-radius: 0px 0px 10px 10px;
		background: #190e08e6;
		border: 1px #ce9767 solid;
		font-size: 18px;
		font-family: sans-serif;
		font-weight: 600;
		font-stretch: condensed;
		letter-spacing: 1px;
		color: #fce1ac;
		text-shadow: 0px 0px 1px;
		transition: 0.5s;
		padding: 2px 10px 3px;
	}
	.scriptMenu_statusHide {
		top: -35px;
		height: 30px;
		overflow: hidden;
	}
	.scriptMenu_label {
		position: absolute;
		top: 30%;
		left: -4px;
		z-index: 9999;
		cursor: pointer;
		width: 30px;
		height: 30px;
		background: radial-gradient(circle, #47a41b 0%, #1a2f04 100%);
		border: 1px solid #1a2f04;
		border-radius: 5px;
		box-shadow:
		inset 0px 2px 4px #83ce26,
		inset 0px -4px 6px #1a2f04,
		0px 0px 2px black,
		0px 0px 0px 2px	#ce9767;
	}
	.scriptMenu_label:hover {
	filter: brightness(1.2);
	}
	.scriptMenu_arrowLabel {
		width: 100%;
		height: 100%;
		background-size: 75%;
		background-position: center;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%2388cb13' d='M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692Z'/%3e%3cpath fill='%2388cb13' d='M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692Z'/%3e%3c/svg%3e");
		box-shadow: 0px 1px 2px #000;
		border-radius: 5px;
		filter: drop-shadow(0px 1px 2px #000D);
	}
	.scriptMenu_main {
		position: absolute;
		max-width: 285px;
		z-index: 9999;
		top: 50%;
		transform: translateY(-40%);
		background: #190e08e6;
		border: 1px #ce9767 solid;
		border-radius: 0px 10px 10px 0px;
		border-left: none;
		padding: 5px 10px 5px 5px;
		box-sizing: border-box;
		font-size: 15px;
		font-family: sans-serif;
		font-weight: 600;
		font-stretch: condensed;
		letter-spacing: 1px;
		color: #fce1ac;
		text-shadow: 0px 0px 1px;
		transition: 1s;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
	}
	.scriptMenu_showMenu {
		display: none;
	}
	.scriptMenu_showMenu:checked~.scriptMenu_main {
		left: 0px;
	}
	.scriptMenu_showMenu:not(:checked)~.scriptMenu_main {
		left: -300px;
	}
	.scriptMenu_divInput {
		margin: 2px;
	}
	.scriptMenu_divInputText {
		margin: 2px;
		align-self: center;
		display: flex;
	}
	.scriptMenu_checkbox {
		position: absolute;
		z-index: -1;
		opacity: 0;
	}
	.scriptMenu_checkbox+label {
		display: inline-flex;
		align-items: center;
		user-select: none;
	}
	.scriptMenu_checkbox+label::before {
		content: '';
		display: inline-block;
		width: 20px;
		height: 20px;
		border: 1px solid #cf9250;
		border-radius: 7px;
		margin-right: 7px;
	}
	.scriptMenu_checkbox:checked+label::before {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2388cb13' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
	}
	.scriptMenu_close {
		width: 40px;
		height: 40px;
		position: absolute;
		right: -18px;
		top: -18px;
		border: 3px solid #c18550;
		border-radius: 20px;
		background: radial-gradient(circle, rgba(190,30,35,1) 0%, rgba(0,0,0,1) 100%);
		background-position-y: 3px;
		box-shadow: -1px 1px 3px black;
		cursor: pointer;
		box-sizing: border-box;
	}
	.scriptMenu_close:hover {
		filter: brightness(1.2);
	}
	.scriptMenu_crossClose {
		width: 100%;
		height: 100%;
		background-size: 65%;
		background-position: center;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%23f4cd73' d='M 0.826 12.559 C 0.431 12.963 3.346 15.374 3.74 14.97 C 4.215 15.173 8.167 10.457 7.804 10.302 C 7.893 10.376 11.454 14.64 11.525 14.372 C 12.134 15.042 15.118 12.086 14.638 11.689 C 14.416 11.21 10.263 7.477 10.402 7.832 C 10.358 7.815 11.731 7.101 14.872 3.114 C 14.698 2.145 13.024 1.074 12.093 1.019 C 11.438 0.861 8.014 5.259 8.035 5.531 C 7.86 5.082 3.61 1.186 3.522 1.59 C 2.973 1.027 0.916 4.611 1.17 4.873 C 0.728 4.914 5.088 7.961 5.61 7.995 C 5.225 7.532 0.622 12.315 0.826 12.559 Z'/%3e%3c/svg%3e")
	}
	.scriptMenu_button {
		user-select: none;
		border-radius: 5px;
		cursor: pointer;
		padding: 5px 14px 8px;
		margin: 4px;
		background: radial-gradient(circle, rgba(165,120,56,1) 80%, rgba(0,0,0,1) 110%);
		box-shadow: inset 0px -4px 6px #442901, inset 0px 1px 6px #442901, inset 0px 0px 6px, 0px 0px 4px, 0px 0px 0px 2px #ce9767;
	}
	.scriptMenu_button:hover {
		filter: brightness(1.2);
	}
	.scriptMenu_buttonText {
		color: #fce5b7;
		text-shadow: 0px 1px 2px black;
		text-align: center;
	}
	.scriptMenu_header {
		text-align: center;
		align-self: center;
		font-size: 15px;
		margin: 0px 15px;
	}
	.scriptMenu_header a {
		color: #fce5b7;
		text-decoration: none;
	}
	.scriptMenu_InputText {
		text-align: center;
		width: 130px;
		height: 24px;
		border: 1px solid #cf9250;
		border-radius: 9px;
		background: transparent;
		color: #fce1ac;
		padding: 0px 10px;
		box-sizing: border-box;
	}
	.scriptMenu_InputText:focus {
		filter: brightness(1.2);
		outline: 0;
	}
	.scriptMenu_InputText::placeholder {
		color: #fce1ac75;
	}
	.scriptMenu_Summary {
		cursor: pointer;
		margin-left: 7px;
	}
	.scriptMenu_Details {
		align-self: center;
	}
`;
		document.head.appendChild(style);
	}

	const addBlocks = () => {
		const main = document.createElement('div');
		document.body.appendChild(main);

		this.status = document.createElement('div');
		this.status.classList.add('scriptMenu_status');
		this.setStatus('');
		main.appendChild(this.status);

		const label = document.createElement('label');
		label.classList.add('scriptMenu_label');
		label.setAttribute('for', 'checkbox_showMenu');
		main.appendChild(label);

		const arrowLabel = document.createElement('div');
		arrowLabel.classList.add('scriptMenu_arrowLabel');
		label.appendChild(arrowLabel);

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = 'checkbox_showMenu';
		checkbox.checked = this.option.showMenu;
		checkbox.classList.add('scriptMenu_showMenu');
		main.appendChild(checkbox);

		this.mainMenu = document.createElement('div');
		this.mainMenu.classList.add('scriptMenu_main');
		main.appendChild(this.mainMenu);

		const closeButton = document.createElement('label');
		closeButton.classList.add('scriptMenu_close');
		closeButton.setAttribute('for', 'checkbox_showMenu');
		this.mainMenu.appendChild(closeButton);

		const crossClose = document.createElement('div');
		crossClose.classList.add('scriptMenu_crossClose');
		closeButton.appendChild(crossClose);
	}

	this.setStatus = (text, onclick) => {
		if (!text) {
			this.status.classList.add('scriptMenu_statusHide');
		} else {
			this.status.classList.remove('scriptMenu_statusHide');
			this.status.innerHTML = text;
		}

		if (typeof onclick == 'function') {
			this.status.addEventListener("click", onclick, {
				once: true
			});
		}
	}

	/**
	 * Adding a text element
	 *
	 * Добавление текстового элемента
	 * @param {String} text text // текст
	 * @param {Function} func Click function // функция по клику
	 * @param {HTMLDivElement} main parent // родитель
	 */
	this.addHeader = (text, func, main) => {
		main = main || this.mainMenu;
		const header = document.createElement('div');
		header.classList.add('scriptMenu_header');
		header.innerHTML = text;
		if (typeof func == 'function') {
			header.addEventListener('click', func);
		}
		main.appendChild(header);
	}

	/**
	 * Adding a button
	 *
	 * Добавление кнопки
	 * @param {String} text
	 * @param {Function} func
	 * @param {String} title
	 * @param {HTMLDivElement} main parent // родитель
	 */
	this.addButton = (text, func, title, main) => {
		main = main || this.mainMenu;
		const button = document.createElement('div');
		button.classList.add('scriptMenu_button');
		button.title = title;
		button.addEventListener('click', func);
		main.appendChild(button);

		const buttonText = document.createElement('div');
		buttonText.classList.add('scriptMenu_buttonText');
		buttonText.innerText = text;
		button.appendChild(buttonText);
		this.buttons.push(button);

		return button;
	}

	/**
	 * Adding checkbox
	 *
	 * Добавление чекбокса
	 * @param {String} label
	 * @param {String} title
	 * @param {HTMLDivElement} main parent // родитель
	 * @returns
	 */
	this.addCheckbox = (label, title, main) => {
		main = main || this.mainMenu;
		const divCheckbox = document.createElement('div');
		divCheckbox.classList.add('scriptMenu_divInput');
		divCheckbox.title = title;
		main.appendChild(divCheckbox);

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = 'scriptMenuCheckbox' + this.checkboxes.length;
		checkbox.classList.add('scriptMenu_checkbox');
		divCheckbox.appendChild(checkbox)

		const checkboxLabel = document.createElement('label');
		checkboxLabel.innerText = label;
		checkboxLabel.setAttribute('for', checkbox.id);
		divCheckbox.appendChild(checkboxLabel);

		this.checkboxes.push(checkbox);
		return checkbox;
	}

	/**
	 * Adding input field
	 *
	 * Добавление поля ввода
	 * @param {String} title
	 * @param {String} placeholder
	 * @param {HTMLDivElement} main parent // родитель
	 * @returns
	 */
	this.addInputText = (title, placeholder, main) => {
		main = main || this.mainMenu;
		const divInputText = document.createElement('div');
		divInputText.classList.add('scriptMenu_divInputText');
		divInputText.title = title;
		main.appendChild(divInputText);

		const newInputText = document.createElement('input');
		newInputText.type = 'text';
		if (placeholder) {
			newInputText.placeholder = placeholder;
		}
		newInputText.classList.add('scriptMenu_InputText');
		divInputText.appendChild(newInputText)
		return newInputText;
	}

	/**
	 * Adds a dropdown block
	 *
	 * Добавляет раскрывающийся блок
	 * @param {String} summary
	 * @param {String} name
	 * @returns
	 */
	this.addDetails = (summaryText, name = null) => {
		const details = document.createElement('details');
		details.classList.add('scriptMenu_Details');
		this.mainMenu.appendChild(details);

		const summary = document.createElement('summary');
		summary.classList.add('scriptMenu_Summary');
		summary.innerText = summaryText;
		if (name) {
			const self = this;
			details.open = this.option.showDetails[name];
			details.dataset.name = name;
			summary.addEventListener('click', () => {
				self.option.showDetails[details.dataset.name] = !details.open;
				self.saveShowDetails(self.option.showDetails);
			});
		}
		details.appendChild(summary);

		return details;
	}

	/**
	 * Saving the expanded state of the details blocks
	 *
	 * Сохранение состояния развенутости блоков details
	 * @param {*} value
	 */
	this.saveShowDetails = (value) => {
		localStorage.setItem('scriptMenu_showDetails', JSON.stringify(value));
	}

	/**
	 * Loading the state of expanded blocks details
	 *
	 * Загрузка состояния развенутости блоков details
	 * @returns
	 */
	this.loadShowDetails = () => {
		let showDetails = localStorage.getItem('scriptMenu_showDetails');

		if (!showDetails) {
			return {};
		}

		try {
			showDetails = JSON.parse(showDetails);
		} catch (e) {
			return {};
		}

		return showDetails;
	}
});
/**
 * Game Library
 *
 * Игровая библиотека
 */
class Library {
	defaultLibUrl = 'https://heroesru-a.akamaihd.net/vk/v1101/lib/lib.json';

	constructor() {
		if (!Library.instance) {
			Library.instance = this;
		}

		return Library.instance;
	}

	async load() {
		try {
			await this.getUrlLib();
			console.log(this.defaultLibUrl);
			this.data = await fetch(this.defaultLibUrl).then(e => e.json())
		} catch (error) {
			console.error('Не удалось загрузить библиотеку', error)
		}
	}

	async getUrlLib() {
		try {
			const db = new Database('hw_cache', 'cache');
			await db.open();
			const cacheLibFullUrl = await db.get('lib/lib.json.gz', false);
			this.defaultLibUrl = cacheLibFullUrl.fullUrl.split('.gz').shift();
		} catch(e) {}
	}

	getData(id) {
		return this.data[id];
	}
}

this.lib = new Library();
/**
 * Database
 *
 * База данных
 */
class Database {
	constructor(dbName, storeName) {
		this.dbName = dbName;
		this.storeName = storeName;
		this.db = null;
	}

	async open() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName);

			request.onerror = () => {
				reject(new Error(`Failed to open database ${this.dbName}`));
			};

			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName);
				}
			};
		});
	}

	async set(key, value) {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.put(value, key);

			request.onerror = () => {
				reject(new Error(`Failed to save value with key ${key}`));
			};

			request.onsuccess = () => {
				resolve();
			};
		});
	}

	async get(key, def) {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction([this.storeName], 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.get(key);

			request.onerror = () => {
				resolve(def);
			};

			request.onsuccess = () => {
				resolve(request.result);
			};
		});
	}

	async delete(key) {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.delete(key);

			request.onerror = () => {
				reject(new Error(`Failed to delete value with key ${key}`));
			};

			request.onsuccess = () => {
				resolve();
			};
		});
	}
}

/**
 * Returns the stored value
 *
 * Возвращает сохраненное значение
 */
function getSaveVal(saveName, def) {
	const result = storage.get(saveName, def);
	return result;
}

/**
 * Stores value
 *
 * Сохраняет значение
 */
function setSaveVal(saveName, value) {
	storage.set(saveName, value);
}

/**
 * Database initialization
 *
 * Инициализация базы данных
 */
const db = new Database(GM_info.script.name, 'settings');

/**
 * Data store
 *
 * Хранилище данных
 */
const storage = {
	userId: 0,
	/**
	 * Default values
	 *
	 * Значения по умолчанию
	 */
	values: [
		...Object.entries(checkboxes).map(e => ({ [e[0]]: e[1].default })),
		...Object.entries(inputs).map(e => ({ [e[0]]: e[1].default })),
		...Object.entries(inputs2).map(e => ({ [e[0]]: e[1].default })),
		...Object.entries(inputs3).map(e => ({ [e[0]]: e[1].default })),
	].reduce((acc, obj) => ({ ...acc, ...obj }), {}),
	name: GM_info.script.name,
	get: function (key, def) {
		if (key in this.values) {
			return this.values[key];
		}
		return def;
	},
	set: function (key, value) {
		this.values[key] = value;
		db.set(this.userId, this.values).catch(
			e => null
		);
		localStorage[this.name + ':' + key] = value;
	},
	delete: function (key) {
		delete this.values[key];
		db.set(this.userId, this.values);
		delete localStorage[this.name + ':' + key];
	}
}

/**
 * Returns all keys from localStorage that start with prefix (for migration)
 *
 * Возвращает все ключи из localStorage которые начинаются с prefix (для миграции)
 */
function getAllValuesStartingWith(prefix) {
	const values = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key.startsWith(prefix)) {
			const val = localStorage.getItem(key);
			const keyValue = key.split(':')[1];
			values.push({ key: keyValue, val });
		}
	}
	return values;
}

/**
 * Opens or migrates to a database
 *
 * Открывает или мигрирует в базу данных
 */
async function openOrMigrateDatabase(userId) {
	storage.userId = userId;
	try {
		await db.open();
	} catch(e) {
		return;
	}
	let settings = await db.get(userId, false);

	if (settings) {
		storage.values = settings;
		return;
	}

	const values = getAllValuesStartingWith(GM_info.script.name);
	for (const value of values) {
		let val = null;
		try {
			val = JSON.parse(value.val);
		} catch {
			break;
		}
		storage.values[value.key] = val;
	}
	await db.set(userId, storage.values);
}

/**
 * Sending expeditions
 *
 * Отправка экспедиций
 */
/*function checkExpedition() {
	return new Promise((resolve, reject) => {
		const expedition = new Expedition(resolve, reject);
		expedition.start();
	});
}
*/
class Expedition {
	checkExpedInfo = {
		calls: [{
			name: "expeditionGet",
			args: {},
			ident: "expeditionGet"
		}, {
			name: "heroGetAll",
			args: {},
			ident: "heroGetAll"
		}]
	}

	constructor(resolve, reject) {
		this.resolve = resolve;
		this.reject = reject;
	}

	async start() {
		const data = await Send(JSON.stringify(this.checkExpedInfo));

		const expedInfo = data.results[0].result.response;
		const dataHeroes = data.results[1].result.response;
		const dataExped = { useHeroes: [], exped: [] };
		const calls = [];

		/**
		 * Adding expeditions to collect
		 * Добавляем экспедиции для сбора
		 */
		for (var n in expedInfo) {
			const exped = expedInfo[n];
			const dateNow = (Date.now() / 1000);
			if (exped.status == 2 && exped.endTime != 0 && dateNow > exped.endTime) {
				calls.push({
					name: "expeditionFarm",
					args: { expeditionId: exped.id },
					ident: "expeditionFarm_" + exped.id
				});
			} else {
				dataExped.useHeroes = dataExped.useHeroes.concat(exped.heroes);
			}
			if (exped.status == 1) {
				dataExped.exped.push({ id: exped.id, power: exped.power });
			}
		}
		dataExped.exped = dataExped.exped.sort((a, b) => (b.power - a.power));

		/**
		 * Putting together a list of heroes
		 * Собираем список героев
		 */
		const heroesArr = [];
		for (let n in dataHeroes) {
			const hero = dataHeroes[n];
			if (hero.xp > 0 && !dataExped.useHeroes.includes(hero.id)) {
				heroesArr.push({ id: hero.id, power: hero.power })
			}
		}

		/**
		 * Adding expeditions to send
		 * Добавляем экспедиции для отправки
		 */
		heroesArr.sort((a, b) => (a.power - b.power));
		for (const exped of dataExped.exped) {
			let heroesIds = this.selectionHeroes(heroesArr, exped.power);
			if (heroesIds && heroesIds.length > 4) {
				for (let q in heroesArr) {
					if (heroesIds.includes(heroesArr[q].id)) {
						delete heroesArr[q];
					}
				}
				calls.push({
					name: "expeditionSendHeroes",
					args: {
						expeditionId: exped.id,
						heroes: heroesIds
					},
					ident: "expeditionSendHeroes_" + exped.id
				});
			}
		}

		await Send(JSON.stringify({ calls }));
		this.end();
	}

	/**
	 * Selection of heroes for expeditions
	 *
	 * Подбор героев для экспедиций
	 */
	selectionHeroes(heroes, power) {
		const resultHeroers = [];
		const heroesIds = [];
		for (let q = 0; q < 5; q++) {
			for (let i in heroes) {
				let hero = heroes[i];
				if (heroesIds.includes(hero.id)) {
					continue;
				}

				const summ = resultHeroers.reduce((acc, hero) => acc + hero.power, 0);
				const need = Math.round((power - summ) / (5 - resultHeroers.length));
				if (hero.power > need) {
					resultHeroers.push(hero);
					heroesIds.push(hero.id);
					break;
				}
			}
		}

		const summ = resultHeroers.reduce((acc, hero) => acc + hero.power, 0);
		if (summ < power) {
			return false;
		}
		return heroesIds;
	}

	/**
	 * Ends expedition script
	 *
	 * Завершает скрипт экспедиции
	 */
	end() {
		setProgress(I18N('EXPEDITIONS_SENT'), true);
		this.resolve()
	}
}

/**
 * Walkthrough of the dungeon
 *
 * Прохождение подземелья
 */
function testDungeon() {
	return new Promise((resolve, reject) => {
		const dung = new executeDungeon(resolve, reject);
		const titanit = getInput('countTitanit');
		dung.start(titanit);
	});
}

/**
 * Walkthrough of the dungeon
 *
 * Прохождение подземелья
 */
function executeDungeon(resolve, reject) {
	dungeonActivity = 0;
	maxDungeonActivity = 150;

	titanGetAll = [];

	teams = {
		heroes: [],
		earth: [],
		fire: [],
		neutral: [],
		water: [],
	}

	titanStats = [];

	titansStates = {};

	callsExecuteDungeon = {
		calls: [{
			name: "dungeonGetInfo",
			args: {},
			ident: "dungeonGetInfo"
		}, {
			name: "teamGetAll",
			args: {},
			ident: "teamGetAll"
		}, {
			name: "teamGetFavor",
			args: {},
			ident: "teamGetFavor"
		}, {
			name: "clanGetInfo",
			args: {},
			ident: "clanGetInfo"
		}, {
			name: "titanGetAll",
			args: {},
			ident: "titanGetAll"
		}, {
			name: "inventoryGet",
			args: {},
			ident: "inventoryGet"
		}]
	}

	this.start = function(titanit) {
		maxDungeonActivity = titanit || getInput('countTitanit');
		send(JSON.stringify(callsExecuteDungeon), startDungeon);
	}

	/**
	 * Getting data on the dungeon
	 *
	 * Получаем данные по подземелью
	 */
	function startDungeon(e) {
		stopDung = false; // стоп подземка
		res = e.results;
		dungeonGetInfo = res[0].result.response;
		if (!dungeonGetInfo) {
			endDungeon('noDungeon', res);
			return;
		}
		teamGetAll = res[1].result.response;
		teamGetFavor = res[2].result.response;
		dungeonActivity = res[3].result.response.stat.todayDungeonActivity;
		titanGetAll = Object.values(res[4].result.response);
		countPredictionCard = res[5].result.response.consumable[81];

		teams.hero = {
			favor: teamGetFavor.dungeon_hero,
			heroes: teamGetAll.dungeon_hero.filter(id => id < 6000),
			teamNum: 0,
		}
		heroPet = teamGetAll.dungeon_hero.filter(id => id >= 6000).pop();
		if (heroPet) {
			teams.hero.pet = heroPet;
		}

		teams.neutral = {
			favor: {},
			heroes: getTitanTeam(titanGetAll, 'neutral'),
			teamNum: 0,
		};
		teams.water = {
			favor: {},
			heroes: getTitanTeam(titanGetAll, 'water'),
			teamNum: 0,
		};
		teams.fire = {
			favor: {},
			heroes: getTitanTeam(titanGetAll, 'fire'),
			teamNum: 0,
		};
		teams.earth = {
			favor: {},
			heroes: getTitanTeam(titanGetAll, 'earth'),
			teamNum: 0,
		};


		checkFloor(dungeonGetInfo);
	}

	function getTitanTeam(titans, type) {
		switch (type) {
			case 'neutral':
				return titans.sort((a, b) => b.power - a.power).slice(0, 5).map(e => e.id);
			case 'water':
				return titans.filter(e => e.id.toString().slice(2, 3) == '0').map(e => e.id);
			case 'fire':
				return titans.filter(e => e.id.toString().slice(2, 3) == '1').map(e => e.id);
			case 'earth':
				return titans.filter(e => e.id.toString().slice(2, 3) == '2').map(e => e.id);
		}
	}

	function getNeutralTeam() {
		const titans = titanGetAll.filter(e => !titansStates[e.id]?.isDead)
		return titans.sort((a, b) => b.power - a.power).slice(0, 5).map(e => e.id);
	}

	function fixTitanTeam(titans) {
		titans.heroes = titans.heroes.filter(e => !titansStates[e]?.isDead);
		return titans;
	}

	/**
	 * Checking the floor
	 *
	 * Проверяем этаж
	 */
	async function checkFloor(dungeonInfo) {
		if (!('floor' in dungeonInfo) || dungeonInfo.floor?.state == 2) {
			saveProgress();
			return;
		}
		// console.log(dungeonInfo, dungeonActivity);
		setProgress(`${I18N('DUNGEON')}: ${I18N('TITANIT')} ${dungeonActivity}/${maxDungeonActivity}`);
		if (dungeonActivity >= maxDungeonActivity) {
			//тест
			//endDungeon('endDungeon', 'maxActive ' + dungeonActivity + '/' + maxDungeonActivity);
			endDungeon('Стоп подземка,', 'набрано титанита: ' + dungeonActivity + '/' + maxDungeonActivity);
			return;
		}
		titansStates = dungeonInfo.states.titans;
		titanStats = titanObjToArray(titansStates);
		if (stopDung){
				endDungeon('Стоп подземка,', 'набрано титанита: ' + dungeonActivity + '/' + maxDungeonActivity);
                return;
            }
		const floorChoices = dungeonInfo.floor.userData;
		const floorType = dungeonInfo.floorType;
		//const primeElement = dungeonInfo.elements.prime;
		if (floorType == "battle") {
			const calls = [];
			for (let teamNum in floorChoices) {
				attackerType = floorChoices[teamNum].attackerType;
				const args = fixTitanTeam(teams[attackerType]);
				if (attackerType == 'neutral') {
					args.heroes = getNeutralTeam();
				}
				if (!args.heroes.length) {
					continue;
				}
				args.teamNum = teamNum;
				calls.push({
					name: "dungeonStartBattle",
					args,
					ident: "body_" + teamNum
				})
			}
			if (!calls.length) {
				endDungeon('endDungeon', 'All Dead');
				return;
			}
			const battleDatas = await Send(JSON.stringify({ calls }))
				.then(e => e.results.map(n => n.result.response))
			const battleResults = [];
			for (n in battleDatas) {
				battleData = battleDatas[n]
				battleData.progress = [{ attackers: { input: ["auto", 0, 0, "auto", 0, 0] } }];
				battleResults.push(await Calc(battleData).then(result => {
					result.teamNum = n;
					result.attackerType = floorChoices[n].attackerType;
					return result;
				}));
			}
			processingPromises(battleResults)
		}
	}

	function processingPromises(results) {
		let selectBattle = results[0];
		if (results.length < 2) {
			// console.log(selectBattle);
			if (!selectBattle.result.win) {
				endDungeon('dungeonEndBattle\n', selectBattle);
				return;
			}
			endBattle(selectBattle);
			return;
		}

		selectBattle = false;
		let bestState = -1000;
		for (const result of results) {
			const recovery = getState(result);
			if (recovery > bestState) {
				bestState = recovery;
				selectBattle = result
			}
		}
		// console.log(selectBattle.teamNum, results);
		if (!selectBattle || bestState <= -1000) {
			endDungeon('dungeonEndBattle\n', results);
			return;
		}

		startBattle(selectBattle.teamNum, selectBattle.attackerType)
			.then(endBattle);
	}

	/**
	 * Let's start the fight
	 *
	 * Начинаем бой
	 */
	function startBattle(teamNum, attackerType) {
		return new Promise(function (resolve, reject) {
			args = fixTitanTeam(teams[attackerType]);
			args.teamNum = teamNum;
			if (attackerType == 'neutral') {
				const titans = titanGetAll.filter(e => !titansStates[e.id]?.isDead)
				args.heroes = titans.sort((a, b) => b.power - a.power).slice(0, 5).map(e => e.id);
			}
			startBattleCall = {
				calls: [{
					name: "dungeonStartBattle",
					args,
					ident: "body"
				}]
			}
			send(JSON.stringify(startBattleCall), resultBattle, {
				resolve,
				teamNum,
				attackerType
			});
		});
	}
	/**
	 * Returns the result of the battle in a promise
	 *
	 * Возращает резульат боя в промис
	 */
	function resultBattle(resultBattles, args) {
		battleData = resultBattles.results[0].result.response;
		battleType = "get_tower";
		if (battleData.type == "dungeon_titan") {
			battleType = "get_titan";
		}
		battleData.progress = [{ attackers: { input: ["auto", 0, 0, "auto", 0, 0] } }];
		BattleCalc(battleData, battleType, function (result) {
			result.teamNum = args.teamNum;
			result.attackerType = args.attackerType;
			args.resolve(result);
		});
	}
	/**
	 * Finishing the fight
	 *
	 * Заканчиваем бой
	 */
	async function endBattle(battleInfo) {
		if (battleInfo.result.win) {
			const args = {
				result: battleInfo.result,
				progress: battleInfo.progress,
			}
			if (countPredictionCard > 0) {
				args.isRaid = true;
			} else {
				const timer = getTimer(battleInfo.battleTime);
				console.log(timer);
				await countdownTimer(timer, `${I18N('DUNGEON')}: ${I18N('TITANIT')} ${dungeonActivity}/${maxDungeonActivity}`);
			}
			const calls = [{
				name: "dungeonEndBattle",
				args,
				ident: "body"
			}];
			lastDungeonBattleData = null;
			send(JSON.stringify({ calls }), resultEndBattle);
		} else {
			endDungeon('dungeonEndBattle win: false\n', battleInfo);
		}
	}

	/**
	 * Getting and processing battle results
	 *
	 * Получаем и обрабатываем результаты боя
	 */
	function resultEndBattle(e) {
		if ('error' in e) {
			popup.confirm(I18N('ERROR_MSG', {
				name: e.error.name,
				description: e.error.description,
			}));
			endDungeon('errorRequest', e);
			return;
		}
		battleResult = e.results[0].result.response;
		if ('error' in battleResult) {
			endDungeon('errorBattleResult', battleResult);
			return;
		}
		dungeonGetInfo = battleResult.dungeon ?? battleResult;
		dungeonActivity += battleResult.reward.dungeonActivity ?? 0;
		checkFloor(dungeonGetInfo);
	}

	/**
	 * Returns the coefficient of condition of the
	 * difference in titanium before and after the battle
	 *
	 * Возвращает коэффициент состояния титанов после боя
	 */
	function getState(result) {
		if (!result.result.win) {
			return -1000;
		}

		let beforeSumFactor = 0;
		const beforeTitans = result.battleData.attackers;
		for (let titanId in beforeTitans) {
			const titan = beforeTitans[titanId];
			const state = titan.state;
			let factor = 1;
			if (state) {
				const hp = state.hp / titan.hp;
				const energy = state.energy / 1e3;
				factor = hp + energy / 20
			}
			beforeSumFactor += factor;
		}

		let afterSumFactor = 0;
		const afterTitans = result.progress[0].attackers.heroes;
		for (let titanId in afterTitans) {
			const titan = afterTitans[titanId];
			const hp = titan.hp / beforeTitans[titanId].hp;
			const energy = titan.energy / 1e3;
			const factor = hp + energy / 20;
			afterSumFactor += factor;
		}
		return afterSumFactor - beforeSumFactor;
	}

	/**
	 * Converts an object with IDs to an array with IDs
	 *
	 * Преобразует объект с идетификаторами в массив с идетификаторами
	 */
	function titanObjToArray(obj) {
		let titans = [];
		for (let id in obj) {
			obj[id].id = id;
			titans.push(obj[id]);
		}
		return titans;
	}

	function saveProgress() {
		let saveProgressCall = {
			calls: [{
				name: "dungeonSaveProgress",
				args: {},
				ident: "body"
			}]
		}
		send(JSON.stringify(saveProgressCall), resultEndBattle);
	}

	function endDungeon(reason, info) {
		console.warn(reason, info);
		setProgress(`${I18N('DUNGEON')} ${I18N('COMPLETED')}`, true);
		resolve();
	}
}

/**
 * Passing the tower
 *
 * Прохождение башни
 */
function testTower() {
	return new Promise((resolve, reject) => {
		tower = new executeTower(resolve, reject);
		tower.start();
	});
}

/**
 * Passing the tower
 *
 * Прохождение башни
 */
function executeTower(resolve, reject) {
	lastTowerInfo = {};

	scullCoin = 0;

	heroGetAll = [];

	heroesStates = {};

	argsBattle = {
		heroes: [],
		favor: {},
	};

	callsExecuteTower = {
		calls: [{
			name: "towerGetInfo",
			args: {},
			ident: "towerGetInfo"
		}, {
			name: "teamGetAll",
			args: {},
			ident: "teamGetAll"
		}, {
			name: "teamGetFavor",
			args: {},
			ident: "teamGetFavor"
		}, {
			name: "inventoryGet",
			args: {},
			ident: "inventoryGet"
		}, {
			name: "heroGetAll",
			args: {},
			ident: "heroGetAll"
		}]
	}

	buffIds = [
		{id: 0, cost: 0, isBuy: false},   // plug // заглушка
		{id: 1, cost: 1, isBuy: true},    // 3% attack // 3% атака
		{id: 2, cost: 6, isBuy: true},    // 2% attack // 2% атака
		{id: 3, cost: 16, isBuy: true},   // 4% attack // 4% атака
		{id: 4, cost: 40, isBuy: true},   // 8% attack // 8% атака
		{id: 5, cost: 1, isBuy: true},    // 10% armor // 10% броня
		{id: 6, cost: 6, isBuy: true},    // 5% armor // 5% броня
		{id: 7, cost: 16, isBuy: true},   // 10% armor // 10% броня
		{id: 8, cost: 40, isBuy: true},   // 20% armor // 20% броня
		{ id: 9, cost: 1, isBuy: true },    // 10% protection from magic // 10% защита от магии
		{ id: 10, cost: 6, isBuy: true },   // 5% protection from magic // 5% защита от магии
		{ id: 11, cost: 16, isBuy: true },  // 10% protection from magic // 10% защита от магии
		{ id: 12, cost: 40, isBuy: true },  // 20% protection from magic // 20% защита от магии
		{ id: 13, cost: 1, isBuy: false },  // 40% health hero // 40% здоровья герою
		{ id: 14, cost: 6, isBuy: false },  // 40% health hero // 40% здоровья герою
		{ id: 15, cost: 16, isBuy: false }, // 80% health hero // 80% здоровья герою
		{ id: 16, cost: 40, isBuy: false }, // 40% health to all heroes // 40% здоровья всем героям
		{ id: 17, cost: 1, isBuy: false },  // 40% energy to the hero // 40% энергии герою
		{ id: 18, cost: 3, isBuy: false },  // 40% energy to the hero // 40% энергии герою
		{ id: 19, cost: 8, isBuy: false },  // 80% energy to the hero // 80% энергии герою
		{ id: 20, cost: 20, isBuy: false }, // 40% energy to all heroes // 40% энергии всем героям
		{ id: 21, cost: 40, isBuy: false }, // Hero Resurrection // Воскрешение героя
	]

	this.start = function () {
		send(JSON.stringify(callsExecuteTower), startTower);
	}

	/**
	 * Getting data on the Tower
	 *
	 * Получаем данные по башне
	 */
	function startTower(e) {
		res = e.results;
		towerGetInfo = res[0].result.response;
		if (!towerGetInfo) {
			endTower('noTower', res);
			return;
		}
		teamGetAll = res[1].result.response;
		teamGetFavor = res[2].result.response;
		inventoryGet = res[3].result.response;
		heroGetAll = Object.values(res[4].result.response);

		scullCoin = inventoryGet.coin[7] ?? 0;

		argsBattle.favor = teamGetFavor.tower;
		argsBattle.heroes = heroGetAll.sort((a, b) => b.power - a.power).slice(0, 5).map(e => e.id);
		pet = teamGetAll.tower.filter(id => id >= 6000).pop();
		if (pet) {
			argsBattle.pet = pet;
		}

		checkFloor(towerGetInfo);
	}

	function fixHeroesTeam(argsBattle) {
		let fixHeroes = argsBattle.heroes.filter(e => !heroesStates[e]?.isDead);
		if (fixHeroes.length < 5) {
			heroGetAll = heroGetAll.filter(e => !heroesStates[e.id]?.isDead);
			fixHeroes = heroGetAll.sort((a, b) => b.power - a.power).slice(0, 5).map(e => e.id);
			Object.keys(argsBattle.favor).forEach(e => {
				if (!fixHeroes.includes(+e)) {
					delete argsBattle.favor[e];
				}
			})
		}
		argsBattle.heroes = fixHeroes;
		return argsBattle;
	}

	/**
	 * Check the floor
	 *
	 * Проверяем этаж
	 */
	function checkFloor(towerInfo) {
		lastTowerInfo = towerInfo;
		maySkipFloor = +towerInfo.maySkipFloor;
		floorNumber = +towerInfo.floorNumber;
		heroesStates = towerInfo.states.heroes;
		floorInfo = towerInfo.floor;

		/**
		 * Is there at least one chest open on the floor
		 * Открыт ли на этаже хоть один сундук
		 */
		isOpenChest = false;
		if (towerInfo.floorType == "chest") {
			isOpenChest = towerInfo.floor.chests.reduce((n, e) => n + e.opened, 0);
		}

		setProgress(`${I18N('TOWER')}: ${I18N('FLOOR')} ${floorNumber}`);
		if (floorNumber > 49) {
			if (isOpenChest) {
				endTower('alreadyOpenChest 50 floor', floorNumber);
				return;
			}
		}
		/**
		 * If the chest is open and you can skip floors, then move on
		 * Если сундук открыт и можно скипать этажи, то переходим дальше
		 */
		if (towerInfo.mayFullSkip && +towerInfo.teamLevel == 130) {
			if (isOpenChest) {
				nextOpenChest(floorNumber);
			} else {
				nextChestOpen(floorNumber);
			}
			return;
		}

		// console.log(towerInfo, scullCoin);
		switch (towerInfo.floorType) {
			case "battle":
				if (floorNumber <= maySkipFloor) {
					skipFloor();
					return;
				}
				if (floorInfo.state == 2) {
					nextFloor();
					return;
				}
				startBattle().then(endBattle);
				return;
			case "buff":
				checkBuff(towerInfo);
				return;
			case "chest":
				openChest(floorNumber);
				return;
			default:
				console.log('!', towerInfo.floorType, towerInfo);
				break;
		}
	}

	/**
	 * Let's start the fight
	 *
	 * Начинаем бой
	 */
	function startBattle() {
		return new Promise(function (resolve, reject) {
			towerStartBattle = {
				calls: [{
					name: "towerStartBattle",
					args: fixHeroesTeam(argsBattle),
					ident: "body"
				}]
			}
			send(JSON.stringify(towerStartBattle), resultBattle, resolve);
		});
	}
	/**
	 * Returns the result of the battle in a promise
	 *
	 * Возращает резульат боя в промис
	 */
	function resultBattle(resultBattles, resolve) {
		battleData = resultBattles.results[0].result.response;
		battleType = "get_tower";
		BattleCalc(battleData, battleType, function (result) {
			resolve(result);
		});
	}
	/**
	 * Finishing the fight
	 *
	 * Заканчиваем бой
	 */
	function endBattle(battleInfo) {
		if (battleInfo.result.stars >= 3) {
			endBattleCall = {
				calls: [{
					name: "towerEndBattle",
					args: {
						result: battleInfo.result,
						progress: battleInfo.progress,
					},
					ident: "body"
				}]
			}
			send(JSON.stringify(endBattleCall), resultEndBattle);
		} else {
			endTower('towerEndBattle win: false\n', battleInfo);
		}
	}

	/**
	 * Getting and processing battle results
	 *
	 * Получаем и обрабатываем результаты боя
	 */
	function resultEndBattle(e) {
		battleResult = e.results[0].result.response;
		if ('error' in battleResult) {
			endTower('errorBattleResult', battleResult);
			return;
		}
		if ('reward' in battleResult) {
			scullCoin += battleResult.reward?.coin[7] ?? 0;
		}
		nextFloor();
	}

	function nextFloor() {
		nextFloorCall = {
			calls: [{
				name: "towerNextFloor",
				args: {},
				ident: "body"
			}]
		}
		send(JSON.stringify(nextFloorCall), checkDataFloor);
	}

	function openChest(floorNumber) {
		floorNumber = floorNumber || 0;
		openChestCall = {
			calls: [{
				name: "towerOpenChest",
				args: {
					num: 2
				},
				ident: "body"
			}]
		}
		send(JSON.stringify(openChestCall), floorNumber < 50 ? nextFloor : lastChest);
	}

	function lastChest() {
		endTower('openChest 50 floor', floorNumber);
	}

	function skipFloor() {
		skipFloorCall = {
			calls: [{
				name: "towerSkipFloor",
				args: {},
				ident: "body"
			}]
		}
		send(JSON.stringify(skipFloorCall), checkDataFloor);
	}

	function checkBuff(towerInfo) {
		buffArr = towerInfo.floor;
		promises = [];
		for (let buff of buffArr) {
			buffInfo = buffIds[buff.id];
			if (buffInfo.isBuy && buffInfo.cost <= scullCoin) {
				scullCoin -= buffInfo.cost;
				promises.push(buyBuff(buff.id));
			}
		}
		Promise.all(promises).then(nextFloor);
	}

	function buyBuff(buffId) {
		return new Promise(function (resolve, reject) {
			buyBuffCall = {
				calls: [{
					name: "towerBuyBuff",
					args: {
						buffId
					},
					ident: "body"
				}]
			}
			send(JSON.stringify(buyBuffCall), resolve);
		});
	}

	function checkDataFloor(result) {
		towerInfo = result.results[0].result.response;
		if ('reward' in towerInfo && towerInfo.reward?.coin) {
			scullCoin += towerInfo.reward?.coin[7] ?? 0;
		}
		if ('tower' in towerInfo) {
			towerInfo = towerInfo.tower;
		}
		if ('skullReward' in towerInfo) {
			scullCoin += towerInfo.skullReward?.coin[7] ?? 0;
		}
		checkFloor(towerInfo);
	}
	/**
	 * Getting tower rewards
	 *
	 * Получаем награды башни
	 */
	function farmTowerRewards(reason) {
		let { pointRewards, points } = lastTowerInfo;
		let pointsAll = Object.getOwnPropertyNames(pointRewards);
		let farmPoints = pointsAll.filter(e => +e <= +points && !pointRewards[e]);
		if (!farmPoints.length) {
			return;
		}
		let farmTowerRewardsCall = {
			calls: [{
				name: "tower_farmPointRewards",
				args: {
					points: farmPoints
				},
				ident: "tower_farmPointRewards"
			}]
		}

		if (scullCoin > 0 && reason == 'openChest 50 floor') {
			farmTowerRewardsCall.calls.push({
				name: "tower_farmSkullReward",
				args: {},
				ident: "tower_farmSkullReward"
			});
		}

		send(JSON.stringify(farmTowerRewardsCall), () => { });
	}

	function fullSkipTower() {
		/**
		 * Next chest
		 *
		 * Следующий сундук
		 */
		function nextChest(n) {
			return {
				name: "towerNextChest",
				args: {},
				ident: "group_" + n + "_body"
			}
		}
		/**
		 * Open chest
		 *
		 * Открыть сундук
		 */
		function openChest(n) {
			return {
				name: "towerOpenChest",
				args: {
					"num": 2
				},
				ident: "group_" + n + "_body"
			}
		}

		const fullSkipTowerCall = {
			calls: []
		}

		let n = 0;
		for (let i = 0; i < 15; i++) {
			fullSkipTowerCall.calls.push(nextChest(++n));
			fullSkipTowerCall.calls.push(openChest(++n));
		}

		send(JSON.stringify(fullSkipTowerCall), data => {
			data.results[0] = data.results[28];
			checkDataFloor(data);
		});
	}

	function nextChestOpen(floorNumber) {
		const calls = [{
			name: "towerOpenChest",
			args: {
				num: 2
			},
			ident: "towerOpenChest"
		}];

		Send(JSON.stringify({ calls })).then(e => {
			nextOpenChest(floorNumber);
		});
	}

	function nextOpenChest(floorNumber) {
		if (floorNumber > 49) {
			endTower('openChest 50 floor', floorNumber);
			return;
		}
		if (floorNumber == 1) {
			fullSkipTower();
			return;
		}

		let nextOpenChestCall = {
			calls: [{
				name: "towerNextChest",
				args: {},
				ident: "towerNextChest"
			}, {
				name: "towerOpenChest",
				args: {
					num: 2
				},
				ident: "towerOpenChest"
			}]
		}
		send(JSON.stringify(nextOpenChestCall), checkDataFloor);
	}

	function endTower(reason, info) {
		console.log(reason, info);
		if (reason != 'noTower') {
			farmTowerRewards(reason);
		}
		setProgress(`${I18N('TOWER')} ${I18N('COMPLETED')}!`, true);
		resolve();
	}
}

/**
 * Passage of the arena of the titans
 *
 * Прохождение арены титанов
 */
function testTitanArena() {
	return new Promise((resolve, reject) => {
		titAren = new executeTitanArena(resolve, reject);
		titAren.start();
	});
}

/**
 * Passage of the arena of the titans
 *
 * Прохождение арены титанов
 */
function executeTitanArena(resolve, reject) {
	let titan_arena = [];
	let finishListBattle = [];
	/**
	 * ID of the current batch
	 *
	 * Идетификатор текущей пачки
	 */
	let currentRival = 0;
	/**
	 * Number of attempts to finish off the pack
	 *
	 * Количество попыток добития пачки
	 */
	let attempts = 0;
	/**
	 * Was there an attempt to finish off the current shooting range
	 *
	 * Была ли попытка добития текущего тира
	 */
	let isCheckCurrentTier = false;
	/**
	 * Current shooting range
	 *
	 * Текущий тир
	 */
	let currTier = 0;
	/**
	 * Number of battles on the current dash
	 *
	 * Количество битв на текущем тире
	 */
	let countRivalsTier = 0;

	let callsStart = {
		calls: [{
			name: "titanArenaGetStatus",
			args: {},
			ident: "titanArenaGetStatus"
		}, {
			name: "teamGetAll",
			args: {},
			ident: "teamGetAll"
		}]
	}

	this.start = function () {
		send(JSON.stringify(callsStart), startTitanArena);
	}

	function startTitanArena(data) {
		let titanArena = data.results[0].result.response;
		if (titanArena.status == 'disabled') {
			endTitanArena('disabled', titanArena);
			return;
		}

		let teamGetAll = data.results[1].result.response;
		titan_arena = teamGetAll.titan_arena;

		checkTier(titanArena)
	}

	function checkTier(titanArena) {
		if (titanArena.status == "peace_time") {
			endTitanArena('Peace_time', titanArena);
			return;
		}
		currTier = titanArena.tier;
		if (currTier) {
			setProgress(`${I18N('TITAN_ARENA')}: ${I18N('LEVEL')} ${currTier}`);
		}

		if (titanArena.status == "completed_tier") {
			titanArenaCompleteTier();
			return;
		}
		/**
		 * Checking for the possibility of a raid
		 * Проверка на возможность рейда
		 */
		if (titanArena.canRaid) {
			titanArenaStartRaid();
			return;
		}
		/**
		 * Check was an attempt to achieve the current shooting range
		 * Проверка была ли попытка добития текущего тира
		 */
		if (!isCheckCurrentTier) {
			checkRivals(titanArena.rivals);
			return;
		}

		endTitanArena('Done or not canRaid', titanArena);
	}
	/**
	 * Submit dash information for verification
	 *
	 * Отправка информации о тире на проверку
	 */
	function checkResultInfo(data) {
		let titanArena = data.results[0].result.response;
		checkTier(titanArena);
	}
	/**
	 * Finish the current tier
	 *
	 * Завершить текущий тир
	 */
	function titanArenaCompleteTier() {
		isCheckCurrentTier = false;
		let calls = [{
			name: "titanArenaCompleteTier",
			args: {},
			ident: "body"
		}];
		send(JSON.stringify({calls}), checkResultInfo);
	}
	/**
	 * Gathering points to be completed
	 *
	 * Собираем точки которые нужно добить
	 */
	function checkRivals(rivals) {
		finishListBattle = [];
		for (let n in rivals) {
			if (rivals[n].attackScore < 250) {
				finishListBattle.push(n);
			}
		}
		console.log('checkRivals', finishListBattle);
		countRivalsTier = finishListBattle.length;
		roundRivals();
	}
	/**
	 * Selecting the next point to finish off
	 *
	 * Выбор следующей точки для добития
	 */
	function roundRivals() {
		let countRivals = finishListBattle.length;
		if (!countRivals) {
			/**
			 * Whole range checked
			 *
			 * Весь тир проверен
			 */
			isCheckCurrentTier = true;
			titanArenaGetStatus();
			return;
		}
		// setProgress('TitanArena: Уровень ' + currTier + ' Бои: ' + (countRivalsTier - countRivals + 1) + '/' + countRivalsTier);
		currentRival = finishListBattle.pop();
		attempts = +currentRival;
		// console.log('roundRivals', currentRival);
		titanArenaStartBattle(currentRival);
	}
	/**
	 * The start of a solo battle
	 *
	 * Начало одиночной битвы
	 */
	function titanArenaStartBattle(rivalId) {
		let calls = [{
			name: "titanArenaStartBattle",
			args: {
				rivalId: rivalId,
				titans: titan_arena
			},
			ident: "body"
		}];
		send(JSON.stringify({calls}), calcResult);
	}
	/**
	 * Calculation of the results of the battle
	 *
	 * Расчет результатов боя
	 */
	function calcResult(data) {
		let battlesInfo = data.results[0].result.response.battle;
		/**
		 * If attempts are equal to the current battle number we make
		 * Если попытки равны номеру текущего боя делаем прерасчет
		 */
		if (attempts == currentRival) {
			preCalcBattle(battlesInfo);
			return;
		}
		/**
		 * If there are still attempts, we calculate a new battle
		 * Если попытки еще есть делаем расчет нового боя
		 */
		if (attempts > 0) {
			attempts--;
			calcBattleResult(battlesInfo)
				.then(resultCalcBattle);
			return;
		}
		/**
		 * Otherwise, go to the next opponent
		 * Иначе переходим к следующему сопернику
		 */
		roundRivals();
	}
	/**
	 * Processing the results of the battle calculation
	 *
	 * Обработка результатов расчета битвы
	 */
	function resultCalcBattle(resultBattle) {
		// console.log('resultCalcBattle', currentRival, attempts, resultBattle.result.win);
		/**
		 * If the current calculation of victory is not a chance or the attempt ended with the finish the battle
		 * Если текущий расчет победа или шансов нет или попытки кончились завершаем бой
		 */
		if (resultBattle.result.win || !attempts) {
			titanArenaEndBattle({
				progress: resultBattle.progress,
				result: resultBattle.result,
				rivalId: resultBattle.battleData.typeId
			});
			return;
		}
		/**
		 * If not victory and there are attempts we start a new battle
		 * Если не победа и есть попытки начинаем новый бой
		 */
		titanArenaStartBattle(resultBattle.battleData.typeId);
	}
	/**
	 * Returns the promise of calculating the results of the battle
	 *
	 * Возращает промис расчета результатов битвы
	 */
	function getBattleInfo(battle, isRandSeed) {
		return new Promise(function (resolve) {
			if (isRandSeed) {
				battle.seed = Math.floor(Date.now() / 1000) + random(0, 1e3);
			}
			// console.log(battle.seed);
			BattleCalc(battle, "get_titanClanPvp", e => resolve(e));
		});
	}
	/**
	 * Recalculate battles
	 *
	 * Прерасчтет битвы
	 */
	function preCalcBattle(battle) {
		let actions = [getBattleInfo(battle, false)];
		const countTestBattle = getInput('countTestBattle');
		for (let i = 0; i < countTestBattle; i++) {
			actions.push(getBattleInfo(battle, true));
		}
		Promise.all(actions)
			.then(resultPreCalcBattle);
	}
	/**
	 * Processing the results of the battle recalculation
	 *
	 * Обработка результатов прерасчета битвы
	 */
	function resultPreCalcBattle(e) {
		let wins = e.map(n => n.result.win);
		let firstBattle = e.shift();
		let countWin = wins.reduce((w, s) => w + s);
		let numReval = countRivalsTier - finishListBattle.length;
		// setProgress('TitanArena: Уровень ' + currTier + ' Бои: ' + numReval + '/' + countRivalsTier + ' - ' + countWin + '/11');
		console.log('resultPreCalcBattle', countWin + '/11' )
		if (countWin > 0) {
			attempts = getInput('countAutoBattle');
		} else {
			attempts = 0;
		}
		resultCalcBattle(firstBattle);
	}

	/**
	 * Complete an arena battle
	 *
	 * Завершить битву на арене
	 */
	function titanArenaEndBattle(args) {
		let calls = [{
			name: "titanArenaEndBattle",
			args,
			ident: "body"
		}];
		send(JSON.stringify({calls}), resultTitanArenaEndBattle);
	}

	function resultTitanArenaEndBattle(e) {
		let attackScore = e.results[0].result.response.attackScore;
		let numReval = countRivalsTier - finishListBattle.length;
		setProgress(`${I18N('TITAN_ARENA')}: ${I18N('LEVEL')} ${currTier} </br>${I18N('BATTLES')}: ${numReval}/${countRivalsTier} - ${attackScore}`);
		/**
		 * TODO: Might need to improve the results.
		 * TODO: Возможно стоит сделать улучшение результатов
		 */
		// console.log('resultTitanArenaEndBattle', e)
		console.log('resultTitanArenaEndBattle', numReval + '/' + countRivalsTier, attempts)
		roundRivals();
	}
	/**
	 * Arena State
	 *
	 * Состояние арены
	 */
	function titanArenaGetStatus() {
		let calls = [{
			name: "titanArenaGetStatus",
			args: {},
			ident: "body"
		}];
		send(JSON.stringify({calls}), checkResultInfo);
	}
	/**
	 * Arena Raid Request
	 *
	 * Запрос рейда арены
	 */
	function titanArenaStartRaid() {
		let calls = [{
			name: "titanArenaStartRaid",
			args: {
				titans: titan_arena
			},
			ident: "body"
		}];
		send(JSON.stringify({calls}), calcResults);
	}

	function calcResults(data) {
		let battlesInfo = data.results[0].result.response;
		let {attackers, rivals} = battlesInfo;

		let promises = [];
		for (let n in rivals) {
			rival = rivals[n];
			promises.push(calcBattleResult({
				attackers: attackers,
				defenders: [rival.team],
				seed: rival.seed,
				typeId: n,
			}));
		}

		Promise.all(promises)
			.then(results => {
				const endResults = {};
				for (let info of results) {
					let id = info.battleData.typeId;
					endResults[id] = {
						progress: info.progress,
						result: info.result,
					}
				}
				titanArenaEndRaid(endResults);
			});
	}

	function calcBattleResult(battleData) {
		return new Promise(function (resolve, reject) {
			BattleCalc(battleData, "get_titanClanPvp", resolve);
		});
	}

	/**
	 * Sending Raid Results
	 *
	 * Отправка результатов рейда
	 */
	function titanArenaEndRaid(results) {
		titanArenaEndRaidCall = {
			calls: [{
				name: "titanArenaEndRaid",
				args: {
					results
				},
				ident: "body"
			}]
		}
		send(JSON.stringify(titanArenaEndRaidCall), checkRaidResults);
	}

	function checkRaidResults(data) {
		results = data.results[0].result.response.results;
		isSucsesRaid = true;
		for (let i in results) {
			isSucsesRaid &&= (results[i].attackScore >= 250);
		}

		if (isSucsesRaid) {
			titanArenaCompleteTier();
		} else {
			titanArenaGetStatus();
		}
	}

	function titanArenaFarmDailyReward() {
		titanArenaFarmDailyRewardCall = {
			calls: [{
				name: "titanArenaFarmDailyReward",
				args: {},
				ident: "body"
			}]
		}
		send(JSON.stringify(titanArenaFarmDailyRewardCall), () => {console.log('Done farm daily reward')});
	}

	function endTitanArena(reason, info) {
		if (!['Peace_time', 'disabled'].includes(reason)) {
			titanArenaFarmDailyReward();
		}
		console.log(reason, info);
		setProgress(`${I18N('TITAN_ARENA')} ${I18N('COMPLETED')}!`, true);
		resolve();
	}
}

function hackGame() {
	self = this;
	selfGame = null;
	bindId = 1e9;
	this.libGame = null;

	/**
	 * List of correspondence of used classes to their names
	 *
	 * Список соответствия используемых классов их названиям
	 */
	ObjectsList = [
		{name:"BattlePresets", prop:"game.battle.controller.thread.BattlePresets"},
		{name:"DataStorage", prop:"game.data.storage.DataStorage"},
		{name:"BattleConfigStorage", prop:"game.data.storage.battle.BattleConfigStorage"},
		{name:"BattleInstantPlay", prop:"game.battle.controller.instant.BattleInstantPlay"},
		{name:"MultiBattleResult", prop:"game.battle.controller.MultiBattleResult"},

		{name:"PlayerMissionData", prop:"game.model.user.mission.PlayerMissionData"},
		{name:"PlayerMissionBattle", prop:"game.model.user.mission.PlayerMissionBattle"},
		{name:"GameModel", prop:"game.model.GameModel"},
		{name:"CommandManager", prop:"game.command.CommandManager"},
		{name:"MissionCommandList", prop:"game.command.rpc.mission.MissionCommandList"},
		{name:"RPCCommandBase", prop:"game.command.rpc.RPCCommandBase"},
		{name:"PlayerTowerData", prop:"game.model.user.tower.PlayerTowerData"},
		{name:"TowerCommandList", prop:"game.command.tower.TowerCommandList"},
		{name:"PlayerHeroTeamResolver", prop:"game.model.user.hero.PlayerHeroTeamResolver"},
		{name:"BattlePausePopup", prop:"game.view.popup.battle.BattlePausePopup"},
		{name:"BattlePopup", prop:"game.view.popup.battle.BattlePopup"},
		{name:"DisplayObjectContainer", prop:"starling.display.DisplayObjectContainer"},
		{name:"GuiClipContainer", prop:"engine.core.clipgui.GuiClipContainer"},
		{name:"BattlePausePopupClip", prop:"game.view.popup.battle.BattlePausePopupClip"},
		{name:"ClipLabel", prop:"game.view.gui.components.ClipLabel"},
		{name:"ClipLabelBase", prop:"game.view.gui.components.ClipLabelBase"},
		{name:"Translate", prop:"com.progrestar.common.lang.Translate"},
		{name:"ClipButtonLabeledCentered", prop:"game.view.gui.components.ClipButtonLabeledCentered"},
		{name:"BattlePausePopupMediator", prop:"game.mediator.gui.popup.battle.BattlePausePopupMediator"},
		{name:"SettingToggleButton", prop:"game.mechanics.settings.popup.view.SettingToggleButton"},
		{name:"PlayerDungeonData", prop:"game.mechanics.dungeon.model.PlayerDungeonData"},
		{name:"NextDayUpdatedManager", prop:"game.model.user.NextDayUpdatedManager"},
		{name:"BattleController", prop:"game.battle.controller.BattleController"},
		{name:"BattleSettingsModel", prop:"game.battle.controller.BattleSettingsModel"},
		{name:"BooleanProperty", prop:"engine.core.utils.property.BooleanProperty"},
		{name:"RuleStorage", prop:"game.data.storage.rule.RuleStorage"},
		{name:"BattleConfig", prop:"battle.BattleConfig"},
		{name:"SpecialShopModel", prop:"game.model.user.shop.SpecialShopModel"},
		{name:"BattleGuiMediator", prop:"game.battle.gui.BattleGuiMediator"},
		{name:"BooleanPropertyWriteable", prop:"engine.core.utils.property.BooleanPropertyWriteable"},
		{ name: "BattleLogEncoder", prop: "battle.log.BattleLogEncoder" },
		{ name: "BattleLogReader", prop: "battle.log.BattleLogReader" },
		{ name: "PlayerSubscriptionInfoValueObject", prop: "game.model.user.subscription.PlayerSubscriptionInfoValueObject" },
	];

	/**
	 * Contains the game classes needed to write and override game methods
	 *
	 * Содержит классы игры необходимые для написания и подмены методов игры
	 */
	Game = {
		/**
		 * Function 'e'
		 * Функция 'e'
		 */
		bindFunc: function (a, b) {
			if (null == b)
				return null;
			null == b.__id__ && (b.__id__ = bindId++);
			var c;
			null == a.hx__closures__ ? a.hx__closures__ = {} :
				c = a.hx__closures__[b.__id__];
			null == c && (c = b.bind(a), a.hx__closures__[b.__id__] = c);
			return c
		},
	};

	/**
	 * Connects to game objects via the object creation event
	 *
	 * Подключается к объектам игры через событие создания объекта
	 */
	function connectGame() {
		for (let obj of ObjectsList) {
			/**
			 * https: //stackoverflow.com/questions/42611719/how-to-intercept-and-modify-a-specific-property-for-any-object
			 */
			Object.defineProperty(Object.prototype, obj.prop, {
				set: function (value) {
					if (!selfGame) {
						selfGame = this;
					}
					if (!Game[obj.name]) {
						Game[obj.name] = value;
					}
					// console.log('set ' + obj.prop, this, value);
					this[obj.prop + '_'] = value;
				},
				get: function () {
					// console.log('get ' + obj.prop, this);
					return this[obj.prop + '_'];
				}
			});
		}
	}

	/**
	 * Game.BattlePresets
	 * @param {bool} a isReplay
	 * @param {bool} b autoToggleable
	 * @param {bool} c auto On Start
	 * @param {object} d config
	 * @param {bool} f showBothTeams
	 */
	/**
	 * Returns the results of the battle to the callback function
	 * Возвращает в функцию callback результаты боя
	 * @param {*} battleData battle data данные боя
	 * @param {*} battleConfig combat configuration type options:
	 *
	 * тип конфигурации боя варианты:
	 *
	 * "get_invasion", "get_titanPvpManual", "get_titanPvp",
	 * "get_titanClanPvp","get_clanPvp","get_titan","get_boss",
	 * "get_tower","get_pve","get_pvpManual","get_pvp","get_core"
	 *
	 * You can specify the xYc function in the game.assets.storage.BattleAssetStorage class
	 *
	 * Можно уточнить в классе game.assets.storage.BattleAssetStorage функция xYc
	 * @param {*} callback функция в которую вернуться результаты боя
	 */
	this.BattleCalc = function (battleData, battleConfig, callback) {
		// battleConfig = battleConfig || getBattleType(battleData.type)
		if (!Game.BattlePresets) throw Error('Use connectGame');
		battlePresets = new Game.BattlePresets(!!battleData.progress, !1, !0, Game.DataStorage[getFn(Game.DataStorage, 24)][getF(Game.BattleConfigStorage, battleConfig)](), !1);
		battleInstantPlay = new Game.BattleInstantPlay(battleData, battlePresets);
		battleInstantPlay[getProtoFn(Game.BattleInstantPlay, 8)].add((battleInstant) => {
			const battleResult = battleInstant[getF(Game.BattleInstantPlay, 'get_result')]();
			const battleData = battleInstant[getF(Game.BattleInstantPlay, 'get_rawBattleInfo')]();
			const battleLog = Game.BattleLogEncoder.read(new Game.BattleLogReader(battleResult[getProtoFn(Game.MultiBattleResult, 2)][0]));
			const timeLimit = battlePresets[getF(Game.BattlePresets, 'get_timeLimit')]();
			const battleTime = Math.max(...battleLog.map(e => e.time < timeLimit ? e.time : 0));
			callback({
				battleTime,
				battleData,
				progress: battleResult[getF(Game.MultiBattleResult, 'get_progress')](),
				result: battleResult[getF(Game.MultiBattleResult, 'get_result')]()
			})
		});
		battleInstantPlay.start();
	}

	/**
	 * Returns a function with the specified name from the class
	 *
	 * Возвращает из класса функцию с указанным именем
	 * @param {Object} classF Class // класс
	 * @param {String} nameF function name // имя функции
	 * @param {String} pos name and alias order // порядок имени и псевдонима
	 * @returns
	 */
	function getF(classF, nameF, pos) {
		pos = pos || false;
		let prop = Object.entries(classF.prototype.__properties__)
		if (!pos) {
			return prop.filter((e) => e[1] == nameF).pop()[0];
		} else {
			return prop.filter((e) => e[0] == nameF).pop()[1];
		}
	}

	/**
	 * Returns a function with the specified name from the class
	 *
	 * Возвращает из класса функцию с указанным именем
	 * @param {Object} classF Class // класс
	 * @param {String} nameF function name // имя функции
	 * @returns
	 */
	function getFnP(classF, nameF) {
		let prop = Object.entries(classF.__properties__)
		return prop.filter((e) => e[1] == nameF).pop()[0];
	}

	/**
	 * Returns the function name with the specified ordinal from the class
	 *
	 * Возвращает имя функции с указаным порядковым номером из класса
	 * @param {Object} classF Class // класс
	 * @param {Number} nF Order number of function // порядковый номер функции
	 * @returns
	 */
	function getFn(classF, nF) {
		let prop = Object.keys(classF);
		return prop[nF];
	}

	/**
	 * Returns the name of the function with the specified serial number from the prototype of the class
	 *
	 * Возвращает имя функции с указаным порядковым номером из прототипа класса
	 * @param {Object} classF Class // класс
	 * @param {Number} nF Order number of function // порядковый номер функции
	 * @returns
	 */
	function getProtoFn(classF, nF) {
		let prop = Object.keys(classF.prototype);
		return prop[nF];
	}
	/**
	 * Description of replaced functions
	 *
	 * Описание подменяемых функций
	 */
	replaceFunction = {
		company: function() {
			let PMD_12 = getProtoFn(Game.PlayerMissionData, 12);
			let oldSkipMisson = Game.PlayerMissionData.prototype[PMD_12];
			Game.PlayerMissionData.prototype[PMD_12] = function (a, b, c) {
				if (!isChecked('passBattle')) {
					oldSkipMisson.call(this, a, b, c);
					return;
				}

				try {
					this[getProtoFn(Game.PlayerMissionData, 9)] = new Game.PlayerMissionBattle(a, b, c);

					var a = new Game.BattlePresets(!1, !1, !0, Game.DataStorage[getFn(Game.DataStorage, 24)][getProtoFn(Game.BattleConfigStorage, 17)](), !1);
					a = new Game.BattleInstantPlay(c, a);
					a[getProtoFn(Game.BattleInstantPlay, 8)].add(Game.bindFunc(this, this.P$h));
					a.start()
				} catch (error) {
					console.error('company', error)
					oldSkipMisson.call(this, a, b, c);
				}
			}

			Game.PlayerMissionData.prototype.P$h = function (a) {
				let GM_2 = getFn(Game.GameModel, 2);
				let GM_P2 = getProtoFn(Game.GameModel, 2);
				let CM_20 = getProtoFn(Game.CommandManager, 20);
				let MCL_2 = getProtoFn(Game.MissionCommandList, 2);
				let MBR_15 = getF(Game.MultiBattleResult, "get_result");
				let RPCCB_15 = getProtoFn(Game.RPCCommandBase, 16);
				let PMD_32 = getProtoFn(Game.PlayerMissionData, 32);
				Game.GameModel[GM_2]()[GM_P2][CM_20][MCL_2](a[MBR_15]())[RPCCB_15](Game.bindFunc(this, this[PMD_32]))
			}
		},
		tower: function() {
			let PTD_67 = getProtoFn(Game.PlayerTowerData, 67);
			let oldSkipTower = Game.PlayerTowerData.prototype[PTD_67];
			Game.PlayerTowerData.prototype[PTD_67] = function (a) {
				if (!isChecked('passBattle')) {
					oldSkipTower.call(this, a);
					return;
				}

				try {
					var p = new Game.BattlePresets(!1, !1, !0, Game.DataStorage[getFn(Game.DataStorage, 24)][getProtoFn(Game.BattleConfigStorage,17)](), !1);
					a = new Game.BattleInstantPlay(a, p);
					a[getProtoFn(Game.BattleInstantPlay,8)].add(Game.bindFunc(this, this.P$h));
					a.start()
				} catch (error) {
					console.error('tower', error)
					oldSkipMisson.call(this, a, b, c);
				}
			}

			Game.PlayerTowerData.prototype.P$h = function (a) {
				const GM_2 = getFnP(Game.GameModel, "get_instance");
				const GM_P2 = getProtoFn(Game.GameModel, 2);
				const CM_29 = getProtoFn(Game.CommandManager, 29);
				const TCL_5 = getProtoFn(Game.TowerCommandList, 5);
				const MBR_15 = getF(Game.MultiBattleResult, "get_result");
				const RPCCB_15 = getProtoFn(Game.RPCCommandBase, 16);
				const PTD_78 = getProtoFn(Game.PlayerTowerData, 78);
				Game.GameModel[GM_2]()[GM_P2][CM_29][TCL_5](a[MBR_15]())[RPCCB_15](Game.bindFunc(this, this[PTD_78]));
			}
		},
		// skipSelectHero: function() {
		// 	if (!HOST) throw Error('Use connectGame');
		// 	Game.PlayerHeroTeamResolver.prototype[getProtoFn(Game.PlayerHeroTeamResolver, 3)] = () => false;
		// },
		passBattle: function() {
			let BPP_4 = getProtoFn(Game.BattlePausePopup, 4);
			let oldPassBattle = Game.BattlePausePopup.prototype[BPP_4];
			Game.BattlePausePopup.prototype[BPP_4] = function (a) {
				if (!isChecked('passBattle')) {
					oldPassBattle.call(this, a);
					return;
				}
				try {
					Game.BattlePopup.prototype[getProtoFn(Game.BattlePausePopup, 4)].call(this, a);
					this[getProtoFn(Game.BattlePausePopup, 3)]();
					this[getProtoFn(Game.DisplayObjectContainer, 3)](this.clip[getProtoFn(Game.GuiClipContainer, 2)]());
					this.clip[getProtoFn(Game.BattlePausePopupClip, 1)][getProtoFn(Game.ClipLabelBase, 9)](Game.Translate.translate("UI_POPUP_BATTLE_PAUSE"));

					this.clip[getProtoFn(Game.BattlePausePopupClip, 2)][getProtoFn(Game.ClipButtonLabeledCentered, 2)](Game.Translate.translate("UI_POPUP_BATTLE_RETREAT"), (q = this[getProtoFn(Game.BattlePausePopup, 1)], Game.bindFunc(q, q[getProtoFn(Game.BattlePausePopupMediator, 17)])));
					this.clip[getProtoFn(Game.BattlePausePopupClip, 5)][getProtoFn(Game.ClipButtonLabeledCentered, 2)](
						this[getProtoFn(Game.BattlePausePopup, 1)][getProtoFn(Game.BattlePausePopupMediator, 14)](),
						this[getProtoFn(Game.BattlePausePopup, 1)][getProtoFn(Game.BattlePausePopupMediator, 13)]() ?
						(q = this[getProtoFn(Game.BattlePausePopup, 1)], Game.bindFunc(q, q[getProtoFn(Game.BattlePausePopupMediator, 18)])) :
						(q = this[getProtoFn(Game.BattlePausePopup, 1)], Game.bindFunc(q, q[getProtoFn(Game.BattlePausePopupMediator, 18)]))
					);

					this.clip[getProtoFn(Game.BattlePausePopupClip, 5)][getProtoFn(Game.ClipButtonLabeledCentered, 0)][getProtoFn(Game.ClipLabelBase, 24)]();
					this.clip[getProtoFn(Game.BattlePausePopupClip, 3)][getProtoFn(Game.SettingToggleButton, 3)](this[getProtoFn(Game.BattlePausePopup, 1)][getProtoFn(Game.BattlePausePopupMediator, 9)]());
					this.clip[getProtoFn(Game.BattlePausePopupClip, 4)][getProtoFn(Game.SettingToggleButton, 3)](this[getProtoFn(Game.BattlePausePopup, 1)][getProtoFn(Game.BattlePausePopupMediator, 10)]());
					this.clip[getProtoFn(Game.BattlePausePopupClip, 6)][getProtoFn(Game.SettingToggleButton, 3)](this[getProtoFn(Game.BattlePausePopup, 1)][getProtoFn(Game.BattlePausePopupMediator, 11)]());
					/*
					Какая-то ненужная фигня
					if (!HC.lSb()) {
						this.clip.r6b.g().B(!1);
						a = this.clip.r6b.g().X() + 7;
						var b = this.clip.ba.g();
						b.$(b.X() - a);
						b = this.clip.IS.g();
						b.sa(b.Fa() - a)
					}
					*/
				} catch(error) {
					console.error('passBattle', error)
					oldPassBattle.call(this, a);
				}
			}

			let retreatButtonLabel = getF(Game.BattlePausePopupMediator, "get_retreatButtonLabel");
			let oldFunc = Game.BattlePausePopupMediator.prototype[retreatButtonLabel];
			Game.BattlePausePopupMediator.prototype[retreatButtonLabel] = function () {
				if (isChecked('passBattle')) {
					return I18N('BTN_PASS');
				} else {
					return oldFunc.call(this);
				}
			}
		},
		endlessCards: function() {
			let PDD_15 = getProtoFn(Game.PlayerDungeonData, 15);
			let oldEndlessCards = Game.PlayerDungeonData.prototype[PDD_15];
			Game.PlayerDungeonData.prototype[PDD_15] = function () {
				if (countPredictionCard <= 0) {
					return true;
				} else {
					return oldEndlessCards.call(this);
				}
			}
		},
		speedBattle: function () {
			const get_timeScale = getF(Game.BattleController, "get_timeScale");
			const oldSpeedBattle = Game.BattleController.prototype[get_timeScale];
			Game.BattleController.prototype[get_timeScale] = function () {
				const speedBattle = Number.parseFloat(getInput('speedBattle'));
				if (!speedBattle) {
					return oldSpeedBattle.call(this);
				}
				try {
					const BC_12 = getProtoFn(Game.BattleController, 12);
					const BSM_12 = getProtoFn(Game.BattleSettingsModel, 12);
					const BP_get_value = getF(Game.BooleanProperty, "get_value");
					if (this[BC_12][BSM_12][BP_get_value]()) {
						return 0;
					}
					const BSM_2 = getProtoFn(Game.BattleSettingsModel, 2);
					const BC_48 = getProtoFn(Game.BattleController, 48);
					const BSM_1 = getProtoFn(Game.BattleSettingsModel, 1);
					const BC_14 = getProtoFn(Game.BattleController, 14);
					const BC_3 = getFn(Game.BattleController, 3);
					if (this[BC_12][BSM_2][BP_get_value]()) {
						var a = speedBattle * this[BC_48]();
					} else {
						a = this[BC_12][BSM_1][BP_get_value]();
						const multiple = a == 2 ? speedBattle : this[BC_14][a];
						//const maxSpeed = Math.max(...this[BC_14]);
						//const multiple = a == this[BC_14].indexOf(maxSpeed) ? (maxSpeed >= 4 ? speedBattle : this[BC_14][a]) : this[BC_14][a];
						a = multiple * Game.BattleController[BC_3][BP_get_value]() * this[BC_48]();
					}
					const BSM_24 = getProtoFn(Game.BattleSettingsModel, 24);
					a > this[BC_12][BSM_24][BP_get_value]() && (a = this[BC_12][BSM_24][BP_get_value]());
					const DS_23 = getFn(Game.DataStorage, 23);
					const get_battleSpeedMultiplier = getF(Game.RuleStorage, "get_battleSpeedMultiplier", true);
					// const RS_167 = getProtoFn(Game.RuleStorage, 167); // get_battleSpeedMultiplier
					var b = Game.DataStorage[DS_23][get_battleSpeedMultiplier]();
					const R_1 = getFn(selfGame.Reflect, 1);
					const BC_1 = getFn(Game.BattleController, 1);
					const get_config = getF(Game.BattlePresets, "get_config");
					// const BC_0 = getProtoFn(Game.BattleConfig, 0); // .ident
					null != b && (a = selfGame.Reflect[R_1](b, this[BC_1][get_config]().ident) ? a * selfGame.Reflect[R_1](b, this[BC_1][get_config]().ident) : a * selfGame.Reflect[R_1](b, "default"));
					return a
				} catch(error) {
					console.error('passBatspeedBattletle', error)
					return oldSpeedBattle.call(this);
				}
			}
		},

		/**
		 * Remove the rare shop
		 *
		 * Удаление торговца редкими товарами
		 */
		/*
		removeWelcomeShop: function () {
			let SSM_3 = getProtoFn(Game.SpecialShopModel, 3);
			const oldWelcomeShop = Game.SpecialShopModel.prototype[SSM_3];
			Game.SpecialShopModel.prototype[SSM_3] = function () {
				if (isChecked('noOfferDonat')) {
					return null;
				} else {
					return oldWelcomeShop.call(this);
				}
			}
		},
		*/

		/**
		 * Acceleration button without Valkyries favor
		 *
		 * Кнопка ускорения без Покровительства Валькирий
		 */
        subscribe: function () {
			const PSIVO_9 = getProtoFn(Game.PlayerSubscriptionInfoValueObject, 9);
			const oldCheckSub = Game.PlayerSubscriptionInfoValueObject.prototype[PSIVO_9];
			Game.PlayerSubscriptionInfoValueObject.prototype[PSIVO_9] = function () {
				let flag = true;
				//console.log(flag)
				if (flag) {
					return true;
				} else {
					return oldCheckSub.call(this);
				}
			}
		},
	}

	/**
	 * Starts replacing recorded functions
	 *
	 * Запускает замену записанных функций
	 */
	this.activateHacks = function () {
		if (!selfGame) throw Error('Use connectGame');
		for (let func in replaceFunction) {
			replaceFunction[func]();
		}
	}

	/**
	 * Returns the game object
	 *
	 * Возвращает объект игры
	 */
	this.getSelfGame = function () {
		return selfGame;
	}

	/**
	 * Updates game data
	 *
	 * Обновляет данные игры
	 */
	this.refreshGame = function () {
		(new Game.NextDayUpdatedManager)[getProtoFn(Game.NextDayUpdatedManager, 5)]();
		try {
			cheats.refreshInventory();
		} catch (e) { }
	}

	/**
	 * Update inventory
	 *
	 * Обновляет инвентарь
	 */
	this.refreshInventory = async function () {
		const GM_INST = getFnP(Game.GameModel, "get_instance");
		const GM_0 = getProtoFn(Game.GameModel, 0);
		const P_24 = getProtoFn(selfGame["game.model.user.Player"], 24);
		const Player = Game.GameModel[GM_INST]()[GM_0];
		Player[P_24] = new selfGame["game.model.user.inventory.PlayerInventory"]
		Player[P_24].init(await Send('{"calls":[{"name":"inventoryGet","args":{},"ident":"inventoryGet"}]}').then(e => e.results[0].result.response))
	}

	/**
	 * Change the play screen on windowName
	 *
	 * Сменить экран игры на windowName
	 *
	 * Possible options:
	 *
	 * Возможные варианты:
	 *
	 * MISSION, ARENA, GRAND, CHEST, SKILLS, SOCIAL_GIFT, CLAN, ENCHANT, TOWER, RATING, CHALLENGE, BOSS, CHAT, CLAN_DUNGEON, CLAN_CHEST, TITAN_GIFT, CLAN_RAID, ASGARD, HERO_ASCENSION, ROLE_ASCENSION, ASCENSION_CHEST, TITAN_MISSION, TITAN_ARENA, TITAN_ARTIFACT, TITAN_ARTIFACT_CHEST, TITAN_VALLEY, TITAN_SPIRITS, TITAN_ARTIFACT_MERCHANT, TITAN_ARENA_HALL_OF_FAME, CLAN_PVP, CLAN_PVP_MERCHANT, CLAN_GLOBAL_PVP, CLAN_GLOBAL_PVP_TITAN, ARTIFACT, ZEPPELIN, ARTIFACT_CHEST, ARTIFACT_MERCHANT, EXPEDITIONS, SUBSCRIPTION, NY2018_GIFTS, NY2018_TREE, NY2018_WELCOME, ADVENTURE, ADVENTURESOLO, SANCTUARY, PET_MERCHANT, PET_LIST, PET_SUMMON, BOSS_RATING_EVENT, BRAWL
	 */
	this.goNavigtor = function (windowName) {
		let mechanicStorage = selfGame["game.data.storage.mechanic.MechanicStorage"];
		let window = mechanicStorage[windowName];
		let event = new selfGame["game.mediator.gui.popup.PopupStashEventParams"];
		let Game = selfGame['Game'];
		let navigator = getF(Game, "get_navigator")
		let navigate = getProtoFn(selfGame["game.screen.navigator.GameNavigator"], 18)
		let instance = getFnP(Game, 'get_instance');
		Game[instance]()[navigator]()[navigate](window, event);
	}

	/**
	 * Move to the sanctuary cheats.goSanctuary()
	 *
	 * Переместиться в святилище cheats.goSanctuary()
	 */
	this.goSanctuary = () => {
		this.goNavigtor("SANCTUARY");
	}

	/**
	 * Go to Guild War
	 *
	 * Перейти к Войне Гильдий
	 */
	this.goClanWar = function() {
		let instance = getFnP(selfGame["game.model.GameModel"], 'get_instance')
		let player = selfGame["game.model.GameModel"][instance]().A;
		let clanWarSelect = selfGame["game.mechanics.cross_clan_war.popup.selectMode.CrossClanWarSelectModeMediator"];
		new clanWarSelect(player).open();
	}

	/**
	 * Go to BrawlShop
	 *
	 * Переместиться в BrawlShop
	 */
	this.goBrawlShop = () => {
		const instance = getFnP(selfGame["game.model.GameModel"], 'get_instance')
		const P_36 = getProtoFn(selfGame["game.model.user.Player"], 36);
		const PSD_0 = getProtoFn(selfGame["game.model.user.shop.PlayerShopData"], 0);
		const IM_0 = getProtoFn(selfGame["haxe.ds.IntMap"], 0);
		const PSDE_4 = getProtoFn(selfGame["game.model.user.shop.PlayerShopDataEntry"], 4);

		const player = selfGame["game.model.GameModel"][instance]().A;
		const shop = player[P_36][PSD_0][IM_0][1038][PSDE_4];
		const shopPopup = new selfGame["game.mechanics.brawl.mediator.BrawlShopPopupMediator"](player, shop)
		shopPopup.open(new selfGame["game.mediator.gui.popup.PopupStashEventParams"])
	}

    /**
	 * Change island map
	 *
	 * Сменить карту острова
	 */
	this.changeIslandMap = (mapId = 2) => {
		const GameInst = getFnP(selfGame['Game'], 'get_instance');
		const GM_0 = getProtoFn(Game.GameModel, 0);
		const P_59 = getProtoFn(selfGame["game.model.user.Player"], 59);
		const Player = Game.GameModel[GameInst]()[GM_0];
		Player[P_59].$({ id: mapId, seasonAdventure: { id: mapId, startDate: 1701914400, endDate: 1709690400, closed: false } });

		const GN_15 = getProtoFn(selfGame["game.screen.navigator.GameNavigator"], 15)
		const navigator = getF(selfGame['Game'], "get_navigator");
		selfGame['Game'][GameInst]()[navigator]()[GN_15](new selfGame["game.mediator.gui.popup.PopupStashEventParams"]);
	}

	/**
	 * Game library availability tracker
	 *
	 * Отслеживание доступности игровой библиотеки
	 */
	function checkLibLoad() {
		timeout = setTimeout(() => {
			if (Game.GameModel) {
				changeLib();
			} else {
				checkLibLoad();
			}
		}, 100)
	}

	/**
	 * Game library data spoofing
	 *
	 * Подмена данных игровой библиотеки
	 */
	function changeLib() {
		console.log('lib connect');
		const originalStartFunc = Game.GameModel.prototype.start;
		Game.GameModel.prototype.start = function (a, b, c) {
			self.libGame = b.raw;
			try {
				b.raw.shop[26].requirements = null;
				b.raw.shop[28].requirements = null;
                b.raw.shop[29].requirements = null;
			} catch (e) {
				console.warn(e);
			}
			originalStartFunc.call(this, a, b, c);
		}
	}

	/**
	 * Returns the value of a language constant
	 *
	 * Возвращает значение языковой константы
	 * @param {*} langConst language constant // языковая константа
	 * @returns
	 */
	this.translate = function (langConst) {
		return Game.Translate.translate(langConst);
	}

	connectGame();
	checkLibLoad();
}

/**
 * Auto collection of gifts
 *
 * Автосбор подарков
 */
function getAutoGifts() {
	let valName = 'giftSendIds_' + userInfo.id;

	if (!localStorage['clearGift' + userInfo.id]) {
		localStorage[valName] = '';
		localStorage['clearGift' + userInfo.id] = '+';
	}

	if (!localStorage[valName]) {
		localStorage[valName] = '';
	}

	/**
	 * Submit a request to receive gift codes
	 *
	 * Отправка запроса для получения кодов подарков
	 */
	fetch('https://zingery.ru/heroes/getGifts.php', {
			method: 'POST',
			body: JSON.stringify({scriptInfo, userInfo})
	}).then(
		response => response.json()
	).then(
		data => {
			let freebieCheckCalls = {
				calls: []
			}
			data.forEach((giftId, n) => {
				if (localStorage[valName].includes(giftId)) return;
				//localStorage[valName] += ';' + giftId;
				freebieCheckCalls.calls.push({
					name: "freebieCheck",
					args: {
						giftId
					},
					ident: giftId
				});
			});

			if (!freebieCheckCalls.calls.length) {
				return;
			}

			send(JSON.stringify(freebieCheckCalls), e => {
				let countGetGifts = 0;
				const gifts = [];
				for (check of e.results) {
					gifts.push(check.ident);
					if (check.result.response != null) {
						countGetGifts++;
					}
				}
				const saveGifts = localStorage[valName].split(';');
				localStorage[valName] = [...saveGifts, ...gifts].slice(-50).join(';');
				console.log(`${I18N('GIFTS')}: ${countGetGifts}`);
			});
		}
	)
}

/**
 * To fill the kills in the Forge of Souls
 *
 * Набить килов в горниле душ
 */
async function bossRatingEvent() {
	const topGet = await Send(JSON.stringify({ calls: [{ name: "topGet", args: { type: "bossRatingTop", extraId: 0 }, ident: "body" }] }));
	if (!topGet) {
		setProgress(`${I18N('EVENT')} ${I18N('NOT_AVAILABLE')}`, true);
		return;
	}
	const replayId = topGet.results[0].result.response[0].userData.replayId;
	const result = await Send(JSON.stringify({
		calls: [
			{ name: "battleGetReplay", args: { id: replayId }, ident: "battleGetReplay" },
			{ name: "heroGetAll", args: {}, ident: "heroGetAll" },
			{ name: "pet_getAll", args: {}, ident: "pet_getAll" },
			{ name: "offerGetAll", args: {}, ident: "offerGetAll" }
		]
	}));
	const bossEventInfo = result.results[3].result.response.find(e => e.offerType == "bossEvent");
	if (!bossEventInfo) {
		setProgress(`${I18N('EVENT')} ${I18N('NOT_AVAILABLE')}`, true);
		return;
	}
	const usedHeroes = bossEventInfo.progress.usedHeroes;
	const party = Object.values(result.results[0].result.response.replay.attackers);
	const availableHeroes = Object.values(result.results[1].result.response).map(e => e.id);
	const availablePets = Object.values(result.results[2].result.response).map(e => e.id);
	const calls = [];
	/**
	 * First pack
	 *
	 * Первая пачка
	 */
	const args = {
		heroes: [],
		favor: {}
	}
	for (let hero of party) {
		if (hero.id >= 6000 && availablePets.includes(hero.id)) {
			args.pet = hero.id;
			continue;
		}
		if (!availableHeroes.includes(hero.id) || usedHeroes.includes(hero.id)) {
			continue;
		}
		args.heroes.push(hero.id);
		if (hero.favorPetId) {
			args.favor[hero.id] = hero.favorPetId;
		}
	}
	if (args.heroes.length) {
		calls.push({
			name: "bossRatingEvent_startBattle",
			args,
			ident: "body_0"
		});
	}
	/**
	 * Other packs
	 *
	 * Другие пачки
	 */
	let heroes = [];
	let count = 1;
	while (heroId = availableHeroes.pop()) {
		if (args.heroes.includes(heroId) || usedHeroes.includes(heroId)) {
			continue;
		}
		heroes.push(heroId);
		if (heroes.length == 5) {
			calls.push({
				name: "bossRatingEvent_startBattle",
				args: {
					heroes: [...heroes],
					pet: availablePets[Math.floor(Math.random() * availablePets.length)]
				},
				ident: "body_" + count
			});
			heroes = [];
			count++;
		}
	}

	if (!calls.length) {
		setProgress(`${I18N('NO_HEROES')}`, true);
		return;
	}

	const resultBattles = await Send(JSON.stringify({ calls }));
	console.log(resultBattles);
	rewardBossRatingEvent();
}

/**
 * Collecting Rewards from the Forge of Souls
 *
 * Сбор награды из Горнила Душ
 */
function rewardBossRatingEvent() {
	let rewardBossRatingCall = '{"calls":[{"name":"offerGetAll","args":{},"ident":"offerGetAll"}]}';
	send(rewardBossRatingCall, function (data) {
		let bossEventInfo = data.results[0].result.response.find(e => e.offerType == "bossEvent");
		if (!bossEventInfo) {
			setProgress(`${I18N('EVENT')} ${I18N('NOT_AVAILABLE')}`, true);
			return;
		}

		let farmedChests = bossEventInfo.progress.farmedChests;
		let score = bossEventInfo.progress.score;
		setProgress(`${I18N('DAMAGE_AMOUNT')}: ${score}`);
		let revard = bossEventInfo.reward;

		let getRewardCall = {
			calls: []
		}

		let count = 0;
		for (let i = 1; i < 10; i++) {
			if (farmedChests.includes(i)) {
				continue;
			}
			if (score < revard[i].score) {
				break;
			}
			getRewardCall.calls.push({
				name: "bossRatingEvent_getReward",
				args: {
					rewardId: i
				},
				ident: "body_" + i
			});
			count++;
		}
		if (!count) {
			setProgress(`${I18N('NOTHING_TO_COLLECT')}`, true);
			return;
		}

		send(JSON.stringify(getRewardCall), e => {
			console.log(e);
			setProgress(`${I18N('COLLECTED')} ${e?.results?.length} ${I18N('REWARD')}`, true);
		});
	});
}

/**
 * Collect Easter eggs and event rewards
 *
 * Собрать пасхалки и награды событий
 */
function offerFarmAllReward() {
	const offerGetAllCall = '{"calls":[{"name":"offerGetAll","args":{},"ident":"offerGetAll"}]}';
	return Send(offerGetAllCall).then((data) => {
		const offerGetAll = data.results[0].result.response.filter(e => e.type == "reward" && !e?.freeRewardObtained && e.reward);
		if (!offerGetAll.length) {
			setProgress(`${I18N('NOTHING_TO_COLLECT')}`, true);
			return;
		}

		const calls = [];
		for (let reward of offerGetAll) {
			calls.push({
				name: "offerFarmReward",
				args: {
					offerId: reward.id
				},
				ident: "offerFarmReward_" + reward.id
			});
		}

		return Send(JSON.stringify({ calls })).then(e => {
			console.log(e);
			setProgress(`${I18N('COLLECTED')} ${e?.results?.length} ${I18N('REWARD')}`, true);
		});
	});
}

/**
 * Assemble Outland
 *
 * Собрать запределье
 */
function getOutland() {
	return new Promise(function (resolve, reject) {
		send('{"calls":[{"name":"bossGetAll","args":{},"ident":"bossGetAll"}]}', e => {
			let bosses = e.results[0].result.response;

			let bossRaidOpenChestCall = {
				calls: []
			};

			for (let boss of bosses) {
				if (boss.mayRaid) {
					bossRaidOpenChestCall.calls.push({
						name: "bossRaid",
						args: {
							bossId: boss.id
						},
						ident: "bossRaid_" + boss.id
					});
					bossRaidOpenChestCall.calls.push({
						name: "bossOpenChest",
						args: {
							bossId: boss.id,
							amount: 1,
							starmoney: 0
						},
						ident: "bossOpenChest_" + boss.id
					});
				} else if (boss.chestId == 1) {
					bossRaidOpenChestCall.calls.push({
						name: "bossOpenChest",
						args: {
							bossId: boss.id,
							amount: 1,
							starmoney: 0
						},
						ident: "bossOpenChest_" + boss.id
					});
				}
			}

			if (!bossRaidOpenChestCall.calls.length) {
				setProgress(`${I18N('OUTLAND')} ${I18N('NOTHING_TO_COLLECT')}`, true);
				resolve();
				return;
			}

			send(JSON.stringify(bossRaidOpenChestCall), e => {
				setProgress(`${I18N('OUTLAND')} ${I18N('COLLECTED')}`, true);
				resolve();
			});
		});
	});
}

/**
 * Collect all rewards
 *
 * Собрать все награды
 */
function questAllFarm() {
	return new Promise(function (resolve, reject) {
		let questGetAllCall = {
			calls: [{
				name: "questGetAll",
				args: {},
				ident: "body"
			}]
		}
		send(JSON.stringify(questGetAllCall), function (data) {
			let questGetAll = data.results[0].result.response;
			const questAllFarmCall = {
				calls: []
			}
			let number = 0;
			for (let quest of questGetAll) {
				if (quest.id < 1e6 && quest.state == 2) {
					questAllFarmCall.calls.push({
						name: "questFarm",
						args: {
							questId: quest.id
						},
						ident: `group_${number}_body`
					});
					number++;
				}
			}

			if (!questAllFarmCall.calls.length) {
				setProgress(`${I18N('COLLECTED')} ${number} ${I18N('REWARD')}`, true);
				resolve();
				return;
			}

			send(JSON.stringify(questAllFarmCall), function (res) {
				console.log(res);
				setProgress(`${I18N('COLLECTED')} ${number} ${I18N('REWARD')}`, true);
				resolve();
			});
		});
	})
}

/**
 * Mission auto repeat
 *
 * Автоповтор миссии
 * isStopSendMission = false;
 * isSendsMission = true;
 **/
this.sendsMission = async function (param) {
	if (isStopSendMission) {
		isSendsMission = false;
		console.log(I18N('STOPPED'));
		setProgress('');
		await popup.confirm(`${I18N('STOPPED')}<br>${I18N('REPETITIONS')}: ${param.count}`, [{
			msg: 'Ok',
			result: true
		}, ])
		return;
	}

	let missionStartCall = {
		"calls": [{
			"name": "missionStart",
			"args": lastMissionStart,
			"ident": "body"
		}]
	}
	/**
	 * Mission Request
	 *
	 * Запрос на выполнение мисии
	 */
	SendRequest(JSON.stringify(missionStartCall), async e => {
		if (e['error']) {
			isSendsMission = false;
			console.log(e['error']);
			setProgress('');
			let msg = e['error'].name + ' ' + e['error'].description + `<br>${I18N('REPETITIONS')}: ${param.count}`;
			await popup.confirm(msg, [
				{msg: 'Ok', result: true},
			])
			return;
		}
		/**
		 * Mission data calculation
		 *
		 * Расчет данных мисии
		 */
		BattleCalc(e.results[0].result.response, 'get_tower', async r => {

			let missionEndCall = {
				"calls": [{
					"name": "missionEnd",
					"args": {
						"id": param.id,
						"result": r.result,
						"progress": r.progress
					},
					"ident": "body"
				}]
			}
			/**
			 * Mission Completion Request
			 *
			 * Запрос на завершение миссии
			 */
			SendRequest(JSON.stringify(missionEndCall), async (e) => {
				if (e['error']) {
					isSendsMission = false;
					console.log(e['error']);
					setProgress('');
					let msg = e['error'].name + ' ' + e['error'].description + `<br>${I18N('REPETITIONS')}: ${param.count}`;
					await popup.confirm(msg, [
						{msg: 'Ok', result: true},
					])
					return;
				}
				r = e.results[0].result.response;
				if (r['error']) {
					isSendsMission = false;
					console.log(r['error']);
					setProgress('');
					await popup.confirm(`<br>${I18N('REPETITIONS')}: ${param.count}` + ' 3 ' + r['error'], [
						{msg: 'Ok', result: true},
					])
					return;
				}

				param.count++;
				let RaidMission = getInput('countRaid');

                    if (RaidMission==param.count){
                    isStopSendMission = true;
                    console.log(RaidMission);
                    }
				setProgress(`${I18N('MISSIONS_PASSED')}: ${param.count} (${I18N('STOP')})`, false, () => {
					isStopSendMission = true;
				});
				setTimeout(sendsMission, 1, param);
			});
		})
	});
}

/**
 * Recursive opening of matryoshka dolls
 *
 * Рекурсивное открытие матрешек
 */
 async function openRussianDolls(libId, amount) {
	let sum = 0;
	let sumResult = [];

	while (amount) {
		sum += amount;
		setProgress(`${I18N('TOTAL_OPEN')} ${sum}`);
		const calls = [{
			name: "consumableUseLootBox",
			args: { libId, amount },
			ident: "body"
		}];
		const result = await Send(JSON.stringify({ calls })).then(e => e.results[0].result.response);
		let newCount = 0;
		for (let n of result) {
			if (n?.consumable && n.consumable[libId]) {
				newCount += n.consumable[libId]
			}
		}
		sumResult = [...sumResult, ...result];
		amount = newCount;
	}

	setProgress(`${I18N('TOTAL_OPEN')} ${sum}`, 5000);
	return sumResult;
}

/**
 * Collect all mail, except letters with energy and charges of the portal
 *
 * Собрать всю почту, кроме писем с энергией и зарядами портала
 */
function mailGetAll() {
	const getMailInfo = '{"calls":[{"name":"mailGetAll","args":{},"ident":"body"}]}';

	return Send(getMailInfo).then(dataMail => {
		const letters = dataMail.results[0].result.response.letters;
		const letterIds = lettersFilter(letters);
		if (!letterIds.length) {
			setProgress(I18N('NOTHING_TO_COLLECT'), true);
			return;
		}

		const calls = [
			{ name: "mailFarm", args: { letterIds }, ident: "body" }
		];

		return Send(JSON.stringify({ calls })).then(res => {
			const lettersIds = res.results[0].result.response;
			if (lettersIds) {
				const countLetters = Object.keys(lettersIds).length;
				setProgress(`${I18N('RECEIVED')} ${countLetters} ${I18N('LETTERS')}`, true);
			}
		});
	});
}

/**
 * Filters received emails
 *
 * Фильтрует получаемые письма
 */
function lettersFilter(letters) {
	const lettersIds = [];
	for (let l in letters) {
		letter = letters[l];
		const reward = letter.reward;
        if (!reward) {
			continue;
		}
		/**
		 * Mail Collection Exceptions
		 *
		 * Исключения на сбор писем
		 */
		const isFarmLetter = !(
			/** Portals // сферы портала */
			(reward?.refillable ? reward.refillable[45] : false) ||
			/** Energy // энергия */
			(reward?.stamina ? reward.stamina : false) ||
			/** accelerating energy gain // ускорение набора энергии */
			(reward?.buff ? true : false) ||
			/** VIP Points // вип очки */
			(reward?.vipPoints ? reward.vipPoints : false) ||
			/** souls of heroes // душы героев */
			(reward?.fragmentHero ? true : false) ||
			/** heroes // герои */
			(reward?.bundleHeroReward ? true : false)
		);
		if (isFarmLetter) {
			lettersIds.push(~~letter.id);
			continue;
		}
		/**
		 * Если до окончания годности письма менее 24 часов,
		 * то оно собирается не смотря на исключения
		 */
		const availableUntil = +letter?.availableUntil;
		if (availableUntil) {
			const maxTimeLeft = 24 * 60 * 60 * 1000;
			const timeLeft = (new Date(availableUntil * 1000) - new Date())
			console.log('Time left:', timeLeft)
			if (timeLeft < maxTimeLeft) {
				lettersIds.push(~~letter.id);
				continue;
			}
		}
	}
	return lettersIds;
}

/**
 * Displaying information about the areas of the portal and attempts on the VG
 *
 * Отображение информации о сферах портала и попытках на ВГ
 */
async function justInfo() {
	return new Promise(async (resolve, reject) => {
		const calls = [{
			name: "userGetInfo",
			args: {},
			ident: "userGetInfo"
		},
		{
			name: "clanWarGetInfo",
			args: {},
			ident: "clanWarGetInfo"
		},
		{
			name: "titanArenaGetStatus",
			args: {},
			ident: "titanArenaGetStatus"
		}];
		const result = await Send(JSON.stringify({ calls }));
		const infos = result.results;
		const portalSphere = infos[0].result.response.refillable.find(n => n.id == 45);
		const clanWarMyTries = infos[1].result.response?.myTries ?? 0;
		const titansLevel = +(infos[2].result.response?.tier ?? 0);
		const titansStatus = infos[2].result.response?.status; //peace_time || battle
		const sanctuaryButton = buttons['goToSanctuary'].button;
		const clanWarButton = buttons['goToClanWar'].button;
		const titansArenaButton = buttons['testTitanArena'].button;

		/*if (portalSphere.amount) {
			sanctuaryButton.style.color = portalSphere.amount >= 3 ? 'red' : 'brown';
			sanctuaryButton.title = `${I18N('SANCTUARY_TITLE')}\n${portalSphere.amount} ${I18N('PORTALS')}`;
		} else {*/
			sanctuaryButton.style.color = '';
			sanctuaryButton.title = I18N('SANCTUARY_TITLE');
		//}
		/*if (clanWarMyTries) {
			clanWarButton.style.color = 'red';
			clanWarButton.title = `${I18N('GUILD_WAR_TITLE')}\n${clanWarMyTries}${I18N('ATTEMPTS')}`;
		} else {*/
			clanWarButton.style.color = '';
			clanWarButton.title = I18N('GUILD_WAR_TITLE');
		//}
		//if (titansLevel < 7 && titansStatus == 'battle') {
		//	const partColor = Math.floor(125 * titansLevel / 7);
		//	titansArenaButton.style.color = `rgb(255,${partColor},${partColor})`;
		//	titansArenaButton.title = `${I18N('TITAN_ARENA_TITLE')}\n${titansLevel} ${I18N('LEVEL')}`;
		//} else {
			titansArenaButton.style.color = '';
			titansArenaButton.title = I18N('TITAN_ARENA_TITLE');
		//}

		//тест убрал подсветку красным в меню
		setProgress('<img src="https://zingery.ru/heroes/portal.png" style="height: 25px;position: relative;top: 5px;"> ' + `${portalSphere.amount} </br> ${I18N('GUILD_WAR')}: ${clanWarMyTries}`, true);
		resolve();
	});
}
// тест сделать все
	/** Отправить подарки  мое*/
	function testclanSendDailyGifts() {

			send('{"calls":[{"name":"clanSendDailyGifts","args":{},"ident":"clanSendDailyGifts"}]}', e => {
					setProgress('Награды собраны', true);});
    }
	/**  Открой сферу артефактов титанов*/
	function testtitanArtifactChestOpen() {
			send('{"calls":[{"name":"titanArtifactChestOpen","args":{"amount":1,"free":true},"ident":"body"}]}',
                 isWeCanDo => {
					return info['inventoryGet']?.consumable[55] > 0
					//setProgress('Награды собраны', true);
            });
    }
    /** Воспользуйся призывом питомцев 1 раз*/
	function testpet_chestOpen() {
			send('{"calls":[{"name":"pet_chestOpen","args":{"amount":1,"paid":false},"ident":"pet_chestOpen"}]}',
                 isWeCanDo => {
					return info['inventoryGet']?.consumable[90] > 0
					//setProgress('Награды собраны', true);
            });
    }
async function buyWithPetExperience() {
	const itemLib = lib.getData('inventoryItem');
	const result = await Send('{"calls":[{"name":"inventoryGet","args":{},"ident":"inventoryGet"},{"name":"shopGet","args":{"shopId":"26"},"ident":"shopGet"}]}').then(e => e.results.map(n => n.result.response));
	const inventory = result[0];
	const slot = Object.values(result[1].slots).find(e => e.cost?.consumable?.[85]);

	const currentCount = inventory.consumable[85];
	const price = slot.cost.consumable[85];

	const typeBuyItem = Object.keys(slot.reward).pop();
	const itemIdBuyItem = Object.keys(slot.reward[typeBuyItem]).pop();
	const countBuyItem = slot.reward[typeBuyItem][itemIdBuyItem];
	const itemName = cheats.translate(`LIB_${typeBuyItem.toUpperCase()}_NAME_${itemIdBuyItem}`);

	if (slot.bought) {
		await popup.confirm(I18N('SECRET_WEALTH_ALREADY'), [
			{ msg: 'Ok', result: true },
		]);
		return;
	}

	const purchaseMsg = I18N('SECRET_WEALTH_BUY', { available: currentCount, countBuy: countBuyItem, name: itemName, price })
	const answer = await popup.confirm(purchaseMsg, [
		{ msg: I18N('BTN_NO'), result: false },
		{ msg: I18N('BTN_YES'), result: true },
	]);

	if (!answer) {
		setProgress(I18N('SECRET_WEALTH_CANCELED'), true);
		return;
	}

	if (currentCount < price) {
		const msg = I18N('SECRET_WEALTH_NOT_ENOUGH', { available: currentCount, need: price });
		await popup.confirm(msg, [
			{ msg: 'Ok', result: true },
		]);
		return;
	}

	const calls = [{
		name: "shopBuy",
		args: {
			shopId: 26,
			slot: slot.id,
			cost: slot.cost,
			reward: slot.reward
		},
		ident: "body"
	}];
	const bought = await Send(JSON.stringify({ calls })).then(e => e.results[0].result.response);

	const type = Object.keys(bought).pop();
	const itemId = Object.keys(bought[type]).pop();
	const count = bought[type][itemId];

	const resultMsg = I18N('SECRET_WEALTH_PURCHASED', { count, name: itemName });
	await popup.confirm(resultMsg, [
		{ msg: 'Ok', result: true },
	]);
}

async function buyWithPetExperienceAuto() {
	const minCount = 450551;
	const result = await Send({calls:[
		{name:"inventoryGet",args:{},ident:"inventoryGet"},
		{name:"shopGet",args:{shopId:"26"},ident:"shopGet_26"},
		{name:"shopGet",args:{shopId:"28"},ident:"shopGet_28"},
		{name:"shopGet",args:{shopId:"29"},ident:"shopGet_29"}
	]}).then(e => e.results.map(n => n.result.response));
	const inventory = result.shift();
	const shops = result;
	const calls = [];

	for (let shop of shops) {
		const slot = Object.values(shop.slots).find(e => e.cost?.consumable?.[85]);

		const currentCount = inventory.consumable[85];
		const price = slot.cost.consumable[85];
		const shopName = I18N('SECRET_WEALTH_SHOP', { name: shop.id });

		if (slot.bought) {
			console.log(shopName + I18N('SECRET_WEALTH_ALREADY'));
			setProgress(shopName + I18N('SECRET_WEALTH_ALREADY'), true);
			continue;
		}

		if (currentCount < price) {
			const msg = shopName + I18N('SECRET_WEALTH_NOT_ENOUGH', { available: currentCount, need: price });
			console.log(msg);
			setProgress(msg, true);
			continue;
		}

		if ((currentCount - price) < minCount) {
			console.log(shopName + I18N('SECRET_WEALTH_UPGRADE_NEW_PET'));
			setProgress(shopName + I18N('SECRET_WEALTH_UPGRADE_NEW_PET'), true);
			continue;
		}

		calls.push({
			name: "shopBuy",
			args: {
				shopId: shop.id,
				slot: slot.id,
				cost: slot.cost,
				reward: slot.reward
			},
			ident: "body"
		});
	}

	if (!calls.length) {
		setProgress(I18N('SECRET_WEALTH') + '<br>' + I18N('NOTHING_BUY'), true);
		return;
	}

	const boughts = await Send(JSON.stringify({ calls })).then(e => e.results);

	let textResult = I18N('SECRET_WEALTH');
	for (const result of boughts) {
		const bought = result.result.response
		const type = Object.keys(bought).pop();
		const itemId = Object.keys(bought[type]).pop();
		const count = bought[type][itemId];
		const itemLib = lib.getData('inventoryItem');
		const itemName = itemLib[type][itemId].label;
		textResult += ' <br>\n' + I18N('SECRET_WEALTH_PURCHASED', { count, name: itemName });
	}

	console.log(textResult, boughts);
	setProgress(textResult, true);
}

async function getDailyBonus() {
	const dailyBonusInfo = await Send(JSON.stringify({
		calls: [{
			name: "dailyBonusGetInfo",
			args: {},
			ident: "body"
		}]
	})).then(e => e.results[0].result.response);
	const { availableToday, availableVip, currentDay } = dailyBonusInfo;

	if (!availableToday) {
		console.log('Уже собрано');
		return;
	}

	const currentVipPoints = +userInfo.vipPoints;
	const dailyBonusStat = lib.getData('dailyBonusStatic');
	const vipInfo = lib.getData('level').vip;
	let currentVipLevel = 0;
	for (let i in vipInfo) {
		vipLvl = vipInfo[i];
		if (currentVipPoints >= vipLvl.vipPoints) {
			currentVipLevel = vipLvl.level;
		}
	}
	const vipLevelDouble = dailyBonusStat[`${currentDay}_0_0`].vipLevelDouble;

	const calls = [{
		name: "dailyBonusFarm",
		args: {
			vip: availableVip && currentVipLevel >= vipLevelDouble ? 1 : 0
		},
		ident: "body"
	}];

	const result = await Send(JSON.stringify({ calls }));
	if (result.error) {
		console.error(result.error);
		return;
	}

	const reward = result.results[0].result.response;
	const type = Object.keys(reward).pop();
	const itemId = Object.keys(reward[type]).pop();
	const count = reward[type][itemId];
	const itemName = cheats.translate(`LIB_${type.toUpperCase()}_NAME_${itemId}`);

	console.log(`Ежедневная награда: Получено ${count} ${itemName}`, reward);
}

async function farmStamina() {
	const lootBox = await Send('{"calls":[{"name":"inventoryGet","args":{},"ident":"inventoryGet"}]}')
		.then(e => e.results[0].result.response.consumable[148]);

	/** Добавить другие ящики */
	if (!lootBox) {
		setProgress(I18N('NO_BOXES'), true);
		return;
	}

	const isOpening = await popup.confirm(I18N('OPEN_LOOTBOX', { lootBox }), [
		{ result: false, isClose: true },
		{ msg: I18N('BTN_YES'), result: true },
	]);

	if (!isOpening) {
		return;
	}

	for (let count = lootBox; count > 0; count--) {
		const result = await Send('{"calls":[{"name":"consumableUseLootBox","args":{"libId":148,"amount":1},"ident":"body"}]}')
			.then(e => e.results[0].result.response[0]);
		if ('stamina' in result) {
			setProgress(`${I18N('OPEN')}: ${lootBox - count}/${lootBox} ${I18N('STAMINA')} +${result.stamina}`, true);
			console.log('stamina +' + result.stamina);
			return;
		} else {
			setProgress(`${I18N('OPEN')}: ${lootBox - count}/${lootBox}`, false);
			console.log(result);
		}
	}

	setProgress(I18N('BOXES_OVER'), true);
}

async function fillActive() {
	const data = await Send(JSON.stringify({
		calls: [{
			name: "questGetAll",
			args: {},
			ident: "questGetAll"
		}, {
			name: "inventoryGet",
			args: {},
			ident: "inventoryGet"
		}, {
			name: "clanGetInfo",
			args: {},
			ident: "clanGetInfo"
		}
	]
	})).then(e => e.results.map(n => n.result.response));

	const quests = data[0];
	const inv = data[1];
	const stat = data[2].stat;
	const maxActive = 2000 - stat.todayItemsActivity;
	if (maxActive <= 0) {
		setProgress(I18N('NO_MORE_ACTIVITY'), true);
		return;
	}

	let countGetActive = 0;
	const quest = quests.find(e => e.id > 10046 && e.id < 10051);
	if (quest) {
		countGetActive = 1750 - quest.progress;
	}

	if (countGetActive <= 0) {
		countGetActive = maxActive;
	}
	console.log(countGetActive);

	countGetActive = +(await popup.confirm(I18N('EXCHANGE_ITEMS', { maxActive }), [
		{ result: false, isClose: true },
		{ msg: I18N('GET_ACTIVITY'), isInput: true, default: countGetActive.toString() },
	]));

	if (!countGetActive) {
		return;
	}

	if (countGetActive > maxActive) {
		countGetActive = maxActive;
	}

	const items = lib.getData('inventoryItem');

	let itemsInfo = [];
	for (let type of ['gear', 'scroll']) {
		for (let i in inv[type]) {
			const v = items[type][i]?.enchantValue || 0;
			itemsInfo.push({
				id: i,
				count: inv[type][i],
				v,
				type
			})
		}
		const invType = 'fragment' + type.toLowerCase().charAt(0).toUpperCase() + type.slice(1);
		for (let i in inv[invType]) {
			const v = items[type][i]?.fragmentEnchantValue || 0;
			itemsInfo.push({
				id: i,
				count: inv[invType][i],
				v,
				type: invType
			})
		}
	}
	itemsInfo = itemsInfo.filter(e => e.v < 4 && e.count > 200);
	itemsInfo = itemsInfo.sort((a, b) => b.count - a.count);
	console.log(itemsInfo);
	const activeItem = itemsInfo.shift();
	console.log(activeItem);
	const countItem = Math.ceil(countGetActive / activeItem.v);
	if (countItem > activeItem.count) {
		setProgress(I18N('NOT_ENOUGH_ITEMS'), true);
		console.log(activeItem);
		return;
	}

	await Send(JSON.stringify({
		calls: [{
			name: "clanItemsForActivity",
			args: {
				items: {
					[activeItem.type]: {
						[activeItem.id]: countItem
					}
				}
			},
			ident: "body"
		}]
	})).then(e => {
		/** TODO: Вывести потраченые предметы */
		console.log(e);
		setProgress(`${I18N('ACTIVITY_RECEIVED')}: ` + e.results[0].result.response, true);
	});
}

async function buyHeroFragments() {
	const result = await Send('{"calls":[{"name":"inventoryGet","args":{},"ident":"inventoryGet"},{"name":"shopGetAll","args":{},"ident":"shopGetAll"}]}')
		.then(e => e.results.map(n => n.result.response));
	const inv = result[0];
	const shops = Object.values(result[1]).filter(shop => [4, 5, 6, 8, 9, 10, 17].includes(shop.id));
	const calls = [];

	for (let shop of shops) {
		const slots = Object.values(shop.slots);
		for (const slot of slots) {
			/* Уже куплено */
			if (slot.bought) {
				continue;
			}
			/* Не душа героя */
			if (!('fragmentHero' in slot.reward)) {
				continue;
			}
			const coin = Object.keys(slot.cost).pop();
			const coinId = Object.keys(slot.cost[coin]).pop();
			const stock = inv[coin][coinId] || 0;
			/* Не хватает на покупку */
			if (slot.cost[coin][coinId] > stock) {
				continue;
			}
			inv[coin][coinId] -= slot.cost[coin][coinId];
			calls.push({
				name: "shopBuy",
				args: {
					shopId: shop.id,
					slot: slot.id,
					cost: slot.cost,
					reward: slot.reward,
				},
				ident: `shopBuy_${shop.id}_${slot.id}`,
			})
		}
	}

	if (!calls.length) {
		setProgress(I18N('NO_PURCHASABLE_HERO_SOULS'), true);
		return;
	}

	const bought = await Send(JSON.stringify({ calls })).then(e => e.results.map(n => n.result.response));
	if (!bought) {
		console.log('что-то пошло не так')
		return;
	}

	let countHeroSouls = 0;
	for (const buy of bought) {
		countHeroSouls += +Object.values(Object.values(buy).pop()).pop();
	}
	console.log(countHeroSouls, bought, calls);
	setProgress(I18N('PURCHASED_HERO_SOULS', { countHeroSouls }), true);
}

/** Открыть платные сундуки в Запределье за 90 */
async function bossOpenChestPay() {
	const info = await Send('{"calls":[{"name":"userGetInfo","args":{},"ident":"userGetInfo"},{"name":"bossGetAll","args":{},"ident":"bossGetAll"}]}')
		.then(e => e.results.map(n => n.result.response));

	const user = info[0];
	const boses = info[1];

	const currentStarMoney = user.starMoney;
	if (currentStarMoney < 540) {
		setProgress(I18N('NOT_ENOUGH_EMERALDS_540', { currentStarMoney }), true);
		return;
	}

	const calls = [];

	let n = 0;
	const amount = 1;
	for (let boss of boses) {
		const bossId = boss.id;
		if (boss.chestNum != 2) {
			continue;
		}
		for (const starmoney of [90, 90, 0]) {
			calls.push({
				name: "bossOpenChest",
				args: {
					bossId,
					amount,
					starmoney
				},
				ident: "bossOpenChest_" + (++n)
			});
		}
	}

	if (!calls.length) {
		setProgress(I18N('CHESTS_NOT_AVAILABLE'), true);
		return;
	}

	const result = await Send(JSON.stringify({ calls }));
	console.log(result);
	if (result?.results) {
		setProgress(`${I18N('OUTLAND_CHESTS_RECEIVED')}: ` + result.results.length, true);
	} else {
		setProgress(I18N('CHESTS_NOT_AVAILABLE'), true);
	}
}

async function autoRaidAdventure() {
	const calls = [
		{
			name: "userGetInfo",
			args: {},
			ident: "userGetInfo"
		},
		{
			name: "adventure_raidGetInfo",
			args: {},
			ident: "adventure_raidGetInfo"
		}
	];
	const result = await Send(JSON.stringify({ calls }))
		.then(e => e.results.map(n => n.result.response));

	const portalSphere = result[0].refillable.find(n => n.id == 45);
	const adventureRaid = Object.entries(result[1].raid).filter(e => e[1]).pop()
	const adventureId = adventureRaid ? adventureRaid[0] : 0;

	if (!portalSphere.amount || !adventureId) {
		setProgress(I18N('RAID_NOT_AVAILABLE'), true);
		return;
	}

	const countRaid = +(await popup.confirm(I18N('RAID_ADVENTURE', { adventureId }), [
		{ result: false, isClose: true },
		{ msg: 'Рейд', isInput: true, default: portalSphere.amount },
	]));

	if (!countRaid) {
		return;
	}

	if (countRaid > portalSphere.amount) {
		countRaid = portalSphere.amount;
	}

	const resultRaid = await Send(JSON.stringify({
		calls: [...Array(countRaid)].map((e, i) => ({
			name: "adventure_raid",
			args: {
				adventureId
			},
			ident: `body_${i}`
		}))
	})).then(e => e.results.map(n => n.result.response));

	if (!resultRaid.length) {
		console.log(resultRaid);
		setProgress(I18N('SOMETHING_WENT_WRONG'), true);
		return;
	}

	console.log(resultRaid, adventureId, portalSphere.amount);
	setProgress(I18N('ADVENTURE_COMPLETED', { adventureId, times: resultRaid.length }), true);
}

/** Вывести всю клановую статистику в консоль браузера */
async function clanStatistic() {
	const copy = function (text) {
		const copyTextarea = document.createElement("textarea");
		copyTextarea.style.opacity = "0";
		copyTextarea.textContent = text;
		document.body.appendChild(copyTextarea);
		copyTextarea.select();
		document.execCommand("copy");
		document.body.removeChild(copyTextarea);
		delete copyTextarea;
	}
	const calls = [
		{ name: "clanGetInfo", args: {}, ident: "clanGetInfo" },
		{ name: "clanGetWeeklyStat", args: {}, ident: "clanGetWeeklyStat" },
		{ name: "clanGetLog", args: {}, ident: "clanGetLog" },
	];

	const result = await Send(JSON.stringify({ calls }));

	const dataClanInfo = result.results[0].result.response;
	const dataClanStat = result.results[1].result.response;
	const dataClanLog = result.results[2].result.response;

	const membersStat = {};
	for (let i = 0; i < dataClanStat.stat.length; i++) {
		membersStat[dataClanStat.stat[i].id] = dataClanStat.stat[i];
	}

	const joinStat = {};
	historyLog = dataClanLog.history;
	for (let j in historyLog) {
		his = historyLog[j];
		if (his.event == 'join') {
			joinStat[his.userId] = his.ctime;
		}
	}

	const infoArr = [];
	const members = dataClanInfo.clan.members;
	for (let n in members) {
		var member = [
			n,
			members[n].name,
			members[n].level,
			dataClanInfo.clan.warriors.includes(+n) ? 1 : 0,
			(new Date(members[n].lastLoginTime * 1000)).toLocaleString().replace(',', ''),
			joinStat[n] ? (new Date(joinStat[n] * 1000)).toLocaleString().replace(',', '') : '',
			membersStat[n].activity.reverse().join('\t'),
			membersStat[n].adventureStat.reverse().join('\t'),
			membersStat[n].clanGifts.reverse().join('\t'),
			membersStat[n].clanWarStat.reverse().join('\t'),
			membersStat[n].dungeonActivity.reverse().join('\t'),
		];
		infoArr.push(member);
	}
	const info = infoArr.sort((a, b) => (b[2] - a[2])).map((e) => e.join('\t')).join('\n');
	console.log(info);
	copy(info);
	setProgress(I18N('CLAN_STAT_COPY'), true);
}

async function buyInStoreForGold() {
	const result = await Send('{"calls":[{"name":"shopGetAll","args":{},"ident":"body"},{"name":"userGetInfo","args":{},"ident":"userGetInfo"}]}').then(e => e.results.map(n => n.result.response));
	const shops = result[0];
	const user = result[1];
	let gold = user.gold;
	const calls = [];
	if (shops[17]) {
		const slots = shops[17].slots;
		for (let i = 1; i <= 2; i++) {
			if (!slots[i].bought) {
				const costGold = slots[i].cost.gold;
				if ((gold - costGold) < 0) {
					continue;
				}
				gold -= costGold;
				calls.push({
					name: "shopBuy",
					args: {
						shopId: 17,
						slot: i,
						cost: slots[i].cost,
						reward: slots[i].reward,
					},
					ident: 'body_' + i,
				})
			}
		}
	}
	const slots = shops[1].slots;
	for (let i = 4; i <= 6; i++) {
		if (!slots[i].bought && slots[i]?.cost?.gold) {
			const costGold = slots[i].cost.gold;
			if ((gold - costGold) < 0) {
				continue;
			}
			gold -= costGold;
			calls.push({
				name: "shopBuy",
				args: {
					shopId: 1,
					slot: i,
					cost: slots[i].cost,
					reward: slots[i].reward,
				},
				ident: 'body_' + i,
			})
		}
	}

	if (!calls.length) {
		setProgress(I18N('NOTHING_BUY'), true);
		return;
	}

	const resultBuy = await Send(JSON.stringify({ calls })).then(e => e.results.map(n => n.result.response));
	console.log(resultBuy);
	const countBuy = resultBuy.length;
	setProgress(I18N('LOTS_BOUGHT', { countBuy }), true);
}

function rewardsAndMailFarm() {
	return new Promise(function (resolve, reject) {
		let questGetAllCall = {
			calls: [{
				name: "questGetAll",
				args: {},
				ident: "questGetAll"
			}, {
				name: "mailGetAll",
				args: {},
				ident: "mailGetAll"
			}]
		}
		send(JSON.stringify(questGetAllCall), function (data) {
			if (!data) return;
			let questGetAll = data.results[0].result.response.filter(e => e.state == 2);
			const questBattlePass = lib.getData('quest').battlePass;
			const questChainBPass = lib.getData('battlePass').questChain;

			const questAllFarmCall = {
				calls: []
			}
			let number = 0;
			for (let quest of questGetAll) {
				if (quest.id > 1e6) {
					const questInfo = questBattlePass[quest.id];
					const chain = questChainBPass[questInfo.chain];
					if (chain.requirement?.battlePassTicket) {
						continue;
					}
				}
				questAllFarmCall.calls.push({
					name: "questFarm",
					args: {
						questId: quest.id
					},
					ident: `questFarm_${number}`
				});
				number++;
			}

			let letters = data?.results[1]?.result?.response?.letters;
			letterIds = lettersFilter(letters);

			if (letterIds.length) {
				questAllFarmCall.calls.push({
					name: "mailFarm",
					args: { letterIds },
					ident: "mailFarm"
				})
			}

			if (!questAllFarmCall.calls.length) {
				setProgress(I18N('NOTHING_TO_COLLECT'), true);
				resolve();
				return;
			}

			send(JSON.stringify(questAllFarmCall), function (res) {
				let reSend = false;
				let countQuests = 0;
				let countMail = 0;
				for (let call of res.results) {
					if (call.ident.includes('questFarm')) {
						countQuests++;
					} else {
						countMail = Object.keys(call.result.response).length;
					}

					/** TODO: Переписать чтоб не вызывать функцию дважды */
					const newQuests = call.result.newQuests;
					if (newQuests) {
						for (let quest of newQuests) {
							if (quest.id < 1e6 && quest.state == 2) {
								reSend = true;
							}
						}
					}
				}
				setProgress(I18N('COLLECT_REWARDS_AND_MAIL', { countQuests, countMail }), true);
				if (reSend) {
					rewardsAndMailFarm()
				}
				resolve();
			});
		});
	})
}

class epicBrawl {
	timeout = null;
	time = null;

	constructor() {
		if (epicBrawl.inst) {
			return epicBrawl.inst;
		}
		epicBrawl.inst = this;
		return this;
	}

	check() {
		console.log(new Date(this.time))
		if (Date.now() > this.time) {
			this.timeout = null;
			this.start()
			return;
		}
		this.timeout = setTimeout(this.check, 6e4);
	}

	async start() {
		if (this.timeout) {
			console.log(new Date(this.time))
			setProgress(I18N('TIMER_ALREADY'), 3000);
			return;
		}
		setProgress(I18N('EPIC_BRAWL'), true);
		const teamInfo = await Send('{"calls":[{"name":"teamGetAll","args":{},"ident":"teamGetAll"},{"name":"teamGetFavor","args":{},"ident":"teamGetFavor"},{"name":"userGetInfo","args":{},"ident":"userGetInfo"}]}').then(e => e.results.map(n => n.result.response));
		const refill = teamInfo[2].refillable.find(n => n.id == 52)
		this.time = (refill.lastRefill + 3600) * 1000
		const attempts = refill.amount;
		if (!attempts) {
			console.log(new Date(this.time));
			this.check();
			setProgress(I18N('NO_ATTEMPTS_TIMER_START'), 3000);
			return;
		}

		const args = {
			heroes: teamInfo[0].epic_brawl.filter(e => e < 1000),
			pet: teamInfo[0].epic_brawl.filter(e => e > 6000).pop(),
			favor: teamInfo[1].epic_brawl,
		}

		let wins = 0;
		let coins = 0;
		let streak = { progress: 0, nextStage: 0 };
		for (let i = attempts; i > 0; i--) {
			const info = await Send(JSON.stringify({
				calls: [
					{ name: "epicBrawl_getEnemy", args: {}, ident: "epicBrawl_getEnemy" }, { name: "epicBrawl_startBattle", args, ident: "epicBrawl_startBattle" }
				]
			})).then(e => e.results.map(n => n.result.response));

			const { progress, result } = await Calc(info[1].battle);
			const endResult = await Send(JSON.stringify({ calls: [{ name: "epicBrawl_endBattle", args: { progress, result }, ident: "epicBrawl_endBattle" }, { name: "epicBrawl_getWinStreak", args: {}, ident: "epicBrawl_getWinStreak" }] })).then(e => e.results.map(n => n.result.response));

			const resultInfo = endResult[0].result;
			streak = endResult[1];

			wins += resultInfo.win;
			coins += resultInfo.reward ? resultInfo.reward.coin[39] : 0;

			console.log(endResult[0].result)
			if (endResult[1].progress == endResult[1].nextStage) {
				const farm = await Send('{"calls":[{"name":"epicBrawl_farmWinStreak","args":{},"ident":"body"}]}').then(e => e.results[0].result.response);
				coins += farm.coin[39];
			}

			setProgress(I18N('EPIC_BRAWL_RESULT', {
				i, wins, attempts, coins,
				progress: streak.progress,
				nextStage: streak.nextStage,
				end: '',
			}), false, hideProgress);
		}

		console.log(new Date(this.time));
		this.check();
		setProgress(I18N('EPIC_BRAWL_RESULT', {
			wins, attempts, coins,
			i: '',
			progress: streak.progress,
			nextStage: streak.nextStage,
			end: I18N('ATTEMPT_ENDED'),
		}), false, hideProgress);
	}
}
/* тест остановка подземки*/
function stopDungeon(e) {
   stopDung = true;
}
function Sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function countdownTimer(seconds, message) {
	message = message || I18N('TIMER');
	const stopTimer = Date.now() + seconds * 1e3
	return new Promise(resolve => {
		const interval = setInterval(async () => {
			const now = Date.now();
			setProgress(`${message} ${((stopTimer - now) / 1000).toFixed(2)}`, false);
			if (now > stopTimer) {
				clearInterval(interval);
				setProgress('', 1);
				resolve();
			}
		}, 100);
	});
}

/** Набить килов в горниле душк */
async function bossRatingEventSouls() {
	const data = await Send({
		calls: [
			{ name: "heroGetAll", args: {}, ident: "teamGetAll" },
			{ name: "offerGetAll", args: {}, ident: "offerGetAll" },
			{ name: "pet_getAll", args: {}, ident: "pet_getAll" },
		]
	});
	const bossEventInfo = data.results[1].result.response.find(e => e.offerType == "bossEvent");
	if (!bossEventInfo) {
		setProgress('Эвент завершен', true);
		return;
	}

	if (bossEventInfo.progress.score > 250) {
		setProgress('Уже убито больше 250 врагов');
		rewardBossRatingEventSouls();
		return;
	}
	const availablePets = Object.values(data.results[2].result.response).map(e => e.id);
	const heroGetAllList = data.results[0].result.response;
	const usedHeroes = bossEventInfo.progress.usedHeroes;
	const heroList = [];

	for (let heroId in heroGetAllList) {
		let hero = heroGetAllList[heroId];
		if (usedHeroes.includes(hero.id)) {
			continue;
		}
		heroList.push(hero.id);
	}

	if (!heroList.length) {
		setProgress('Нет героев', true);
		return;
	}

	const pet = availablePets.includes(6005) ? 6005 : availablePets[Math.floor(Math.random() * availablePets.length)];
	const petLib = lib.getData('pet');
	let count = 1;

	for (const heroId of heroList) {
		const args = {
			heroes: [heroId],
			pet
		}
		/** Поиск питомца для героя */
		for (const petId of availablePets) {
			if (petLib[petId].favorHeroes.includes(heroId)) {
				args.favor = {
					[heroId]: petId
				}
				break;
			}
		}

		const calls = [{
			name: "bossRatingEvent_startBattle",
			args,
			ident: "body"
		}, {
			name: "offerGetAll",
			args: {},
			ident: "offerGetAll"
		}];

		const res = await Send({ calls });
		count++;

		if ('error' in res) {
			console.error(res.error);
			setProgress('Перезагрузите игру и попробуйте позже', true);
			return;
		}

		const eventInfo = res.results[1].result.response.find(e => e.offerType == "bossEvent");
		if (eventInfo.progress.score > 250) {
			break;
		}
		setProgress('Количество убитых врагов: ' + eventInfo.progress.score + '<br>Использовано ' + count + ' героев');
	}

	rewardBossRatingEventSouls();
}
/** Сбор награды из Горнила Душ */
async function rewardBossRatingEventSouls() {
	const data = await Send({
		calls: [
			{ name: "offerGetAll", args: {}, ident: "offerGetAll" }
		]
	});

	const bossEventInfo = data.results[0].result.response.find(e => e.offerType == "bossEvent");
	if (!bossEventInfo) {
		setProgress('Эвент завершен', true);
		return;
	}

	const farmedChests = bossEventInfo.progress.farmedChests;
	const score = bossEventInfo.progress.score;
	// setProgress('Количество убитых врагов: ' + score);
	const revard = bossEventInfo.reward;
	const calls = [];

	let count = 0;
	for (let i = 1; i < 10; i++) {
		if (farmedChests.includes(i)) {
			continue;
		}
		if (score < revard[i].score) {
			break;
		}
		calls.push({
			name: "bossRatingEvent_getReward",
			args: {
				rewardId: i
			},
			ident: "body_" + i
		});
		count++;
	}
	if (!count) {
		setProgress('Нечего собирать', true);
		return;
	}

	Send({ calls }).then(e => {
		console.log(e);
		setProgress('Собрано ' + e?.results?.length + ' наград', true);
	})
}
/**
 * Spin the Seer
 *
 * Покрутить провидца
 */
/*Провидец*/
async function rollAscension() {
	const refillable = await Send({calls:[
		{
			name:"userGetInfo",
			args:{},
			ident:"userGetInfo"
		}
	]}).then(e => e.results[0].result.response.refillable);
	const i47 = refillable.find(i => i.id == 47);
	if (i47?.amount) {
		await Send({ calls: [{ name: "ascensionChest_open", args: { paid: false, amount: 1 }, ident: "body" }] });
		setProgress(I18N('DONE'), true);
	} else {
		setProgress(I18N('NOT_ENOUGH_AP'), true);
	}
}
/**
 * Collect gifts for the New Year
 *
 * Собрать подарки на новый год
 */
function getGiftNewYear() {
	Send({ calls: [{ name: "newYearGiftGet", args: { type: 0 }, ident: "body" }] }).then(e => {
		const gifts = e.results[0].result.response.gifts;
		const calls = gifts.filter(e => e.opened == 0).map(e => ({
			name: "newYearGiftOpen",
			args: {
				giftId: e.id
			},
			ident: `body_${e.id}`
		}));
		if (!calls.length) {
			setProgress(I18N('NY_NO_GIFTS'), 5000);
			return;
		}
		Send({ calls }).then(e => {
			console.log(e.results)
			const msg = I18N('NY_GIFTS_COLLECTED', { count: e.results.length });
			console.log(msg);
			setProgress(msg, 5000);
		});
	})
}
/**
 * Attack of the minions of Asgard
 *
 * Атака прислужников Асгарда
 */
function testRaidNodes() {
	return new Promise((resolve, reject) => {
		const tower = new executeRaidNodes(resolve, reject);
		tower.start();
	});
}

/**
 * Attack of the minions of Asgard
 *
 * Атака прислужников Асгарда
 */
function executeRaidNodes(resolve, reject) {
	let raidData = {
		teams: [],
		favor: {},
		nodes: [],
		attempts: 0,
		countExecuteBattles: 0,
		cancelBattle: 0,
	}

	callsExecuteRaidNodes = {
		calls: [{
			name: "clanRaid_getInfo",
			args: {},
			ident: "clanRaid_getInfo"
		}, {
			name: "teamGetAll",
			args: {},
			ident: "teamGetAll"
		}, {
			name: "teamGetFavor",
			args: {},
			ident: "teamGetFavor"
		}]
	}

	this.start = function () {
		send(JSON.stringify(callsExecuteRaidNodes), startRaidNodes);
	}

	function startRaidNodes(data) {
		res = data.results;
		clanRaidInfo = res[0].result.response;
		teamGetAll = res[1].result.response;
		teamGetFavor = res[2].result.response;

		let index = 0;
		for (let team of teamGetAll.clanRaid_nodes) {
			raidData.teams.push({
				data: {},
				heroes: team.filter(id => id < 6000),
				pet: team.filter(id => id >= 6000).pop(),
				battleIndex: index++
			});
		}
		raidData.favor = teamGetFavor.clanRaid_nodes;

		raidData.nodes = clanRaidInfo.nodes;
		raidData.attempts = clanRaidInfo.attempts;
		isCancalBattle = false;

		checkNodes();
	}

	function getAttackNode() {
		for (let nodeId in raidData.nodes) {
			let node = raidData.nodes[nodeId];
			let points = 0
			for (team of node.teams) {
				points += team.points;
			}
			let now = Date.now() / 1000;
			if (!points && now > node.timestamps.start && now < node.timestamps.end) {
				let countTeam = node.teams.length;
				delete raidData.nodes[nodeId];
				return {
					nodeId,
					countTeam
				};
			}
		}
		return null;
	}

	function checkNodes() {
		setProgress(`${I18N('REMAINING_ATTEMPTS')}: ${raidData.attempts}`);
		let nodeInfo = getAttackNode();
		if (nodeInfo && raidData.attempts) {
			startNodeBattles(nodeInfo);
			return;
		}

		endRaidNodes('EndRaidNodes');
	}

	function startNodeBattles(nodeInfo) {
		let {nodeId, countTeam} = nodeInfo;
		let teams = raidData.teams.slice(0, countTeam);
		let heroes = raidData.teams.map(e => e.heroes).flat();
		let favor = {...raidData.favor};
		for (let heroId in favor) {
			if (!heroes.includes(+heroId)) {
				delete favor[heroId];
			}
		}

		let calls = [{
			name: "clanRaid_startNodeBattles",
			args: {
				nodeId,
				teams,
				favor
			},
			ident: "body"
		}];

		send(JSON.stringify({calls}), resultNodeBattles);
	}

	function resultNodeBattles(e) {
		if (e['error']) {
			endRaidNodes('nodeBattlesError', e['error']);
			return;
		}

		console.log(e);
		let battles = e.results[0].result.response.battles;
		let promises = [];
		let battleIndex = 0;
		for (let battle of battles) {
			battle.battleIndex = battleIndex++;
			promises.push(calcBattleResult(battle));
		}

		Promise.all(promises)
			.then(results => {
				const endResults = {};
				let isAllWin = true;
				for (let r of results) {
					isAllWin &&= r.result.win;
				}
				if (!isAllWin) {
					cancelEndNodeBattle(results[0]);
					return;
				}
				raidData.countExecuteBattles = results.length;
				let timeout = 500;
				for (let r of results) {
					setTimeout(endNodeBattle, timeout, r);
					timeout += 500;
				}
			});
	}
	/**
	 * Returns the battle calculation promise
	 *
	 * Возвращает промис расчета боя
	 */
	function calcBattleResult(battleData) {
		return new Promise(function (resolve, reject) {
			BattleCalc(battleData, "get_clanPvp", resolve);
		});
	}
	/**
	 * Cancels the fight
	 *
	 * Отменяет бой
	 */
	function cancelEndNodeBattle(r) {
		const fixBattle = function (heroes) {
			for (const ids in heroes) {
				hero = heroes[ids];
				hero.energy = random(1, 999);
				if (hero.hp > 0) {
					hero.hp = random(1, hero.hp);
				}
			}
		}
		fixBattle(r.progress[0].attackers.heroes);
		fixBattle(r.progress[0].defenders.heroes);
		endNodeBattle(r);
	}
	/**
	 * Ends the fight
	 *
	 * Завершает бой
	 */
	function endNodeBattle(r) {
		let nodeId = r.battleData.result.nodeId;
		let battleIndex = r.battleData.battleIndex;
		let calls = [{
			name: "clanRaid_endNodeBattle",
			args: {
				nodeId,
				battleIndex,
				result: r.result,
				progress: r.progress
			},
			ident: "body"
		}]

		SendRequest(JSON.stringify({calls}), battleResult);
	}
	/**
	 * Processing the results of the battle
	 *
	 * Обработка результатов боя
	 */
	function battleResult(e) {
		if (e['error']) {
			endRaidNodes('missionEndError', e['error']);
			return;
		}
		r = e.results[0].result.response;
		if (r['error']) {
			if (r.reason == "invalidBattle") {
				raidData.cancelBattle++;
				checkNodes();
			} else {
				endRaidNodes('missionEndError', e['error']);
			}
			return;
		}

		if (!(--raidData.countExecuteBattles)) {
			raidData.attempts--;
			checkNodes();
		}
	}
	/**
	 * Completing a task
	 *
	 * Завершение задачи
	 */
	function endRaidNodes(reason, info) {
		isCancalBattle = true;
		let textCancel = raidData.cancelBattle ? ` ${I18N('BATTLES_CANCELED')}: ${raidData.cancelBattle}` : '';
		setProgress(`${I18N('MINION_RAID')} ${I18N('COMPLETED')}! ${textCancel}`, true);
		console.log(reason, info);
		resolve();
	}
}

/**
 * Asgard Boss Attack Replay
 *
 * Повтор атаки босса Асгарда
 */
function testBossBattle() {
	return new Promise((resolve, reject) => {
		const bossBattle = new executeBossBattle(resolve, reject);
		bossBattle.start(lastBossBattle, lastBossBattleInfo);
	});
}

/**
 * Asgard Boss Attack Replay
 *
 * Повтор атаки босса Асгарда
 */
function executeBossBattle(resolve, reject) {
	let lastBossBattleArgs = {};
	let reachDamage = 0;
	let countBattle = 0;
	let countMaxBattle = 10;
	let lastDamage = 0;

	this.start = function (battleArg, battleInfo) {
		lastBossBattleArgs = battleArg;
		preCalcBattle(battleInfo);
	}

	function getBattleInfo(battle) {
		return new Promise(function (resolve) {
			battle.seed = Math.floor(Date.now() / 1000) + random(0, 1e3);
			BattleCalc(battle, getBattleType(battle.type), e => {
				let extra = e.progress[0].defenders.heroes[1].extra;
				resolve(extra.damageTaken + extra.damageTakenNextLevel);
			});
		});
	}

	function preCalcBattle(battle) {
		let actions = [];
		const countTestBattle = getInput('countTestBattle');
		for (let i = 0; i < countTestBattle; i++) {
			actions.push(getBattleInfo(battle, true));
		}
		Promise.all(actions)
			.then(resultPreCalcBattle);
	}

	function fixDamage(damage) {
		for (let i = 1e6; i > 1; i /= 10) {
			if (damage > i) {
				let n = i / 10;
				damage = Math.ceil(damage / n) * n;
				break;
			}
		}
		return damage;
	}

	async function resultPreCalcBattle(damages) {
		let maxDamage = 0;
		let minDamage = 1e10;
		let avgDamage = 0;
		for (let damage of damages) {
			avgDamage += damage
			if (damage > maxDamage) {
				maxDamage = damage;
			}
			if (damage < minDamage) {
				minDamage = damage;
			}
		}
		avgDamage /= damages.length;
		console.log(damages.map(e => e.toLocaleString()).join('\n'), avgDamage, maxDamage);

		reachDamage = fixDamage(avgDamage);
		const result = await popup.confirm(
			`${I18N('ROUND_STAT')} ${damages.length} ${I18N('BATTLE')}:` +
			`<br>${I18N('MINIMUM')}: ` + minDamage.toLocaleString() +
			`<br>${I18N('MAXIMUM')}: ` + maxDamage.toLocaleString() +
			`<br>${I18N('AVERAGE')}: ` + avgDamage.toLocaleString()
			/*+ '<br>Поиск урона больше чем ' + reachDamage.toLocaleString()*/
			, [
				{ msg: I18N('BTN_OK'), result: 0},
			/* {msg: 'Погнали', isInput: true, default: reachDamage}, */
		])
		if (result) {
			reachDamage = result;
			isCancalBossBattle = false;
			startBossBattle();
			return;
		}
		endBossBattle(I18N('BTN_CANCEL'));
	}

	function startBossBattle() {
		countBattle++;
		countMaxBattle = getInput('countAutoBattle');
		if (countBattle > countMaxBattle) {
			setProgress('Превышен лимит попыток: ' + countMaxBattle, true);
			endBossBattle('Превышен лимит попыток: ' + countMaxBattle);
			return;
		}
		let calls = [{
			name: "clanRaid_startBossBattle",
			args: lastBossBattleArgs,
			ident: "body"
		}];
		send(JSON.stringify({calls}), calcResultBattle);
	}

	function calcResultBattle(e) {
		BattleCalc(e.results[0].result.response.battle, "get_clanPvp", resultBattle);
	}

	async function resultBattle(e) {
		let extra = e.progress[0].defenders.heroes[1].extra
		resultDamage = extra.damageTaken + extra.damageTakenNextLevel
		console.log(resultDamage);
		scriptMenu.setStatus(countBattle + ') ' + resultDamage.toLocaleString());
		lastDamage = resultDamage;
		if (resultDamage > reachDamage && await popup.confirm(countBattle + ') Урон ' + resultDamage.toLocaleString(), [
			{msg: 'Ок', result: true},
			{msg: 'Не пойдет', result: false},
		]))  {
			endBattle(e, false);
			return;
		}
		cancelEndBattle(e);
	}

	function cancelEndBattle (r) {
		const fixBattle = function (heroes) {
			for (const ids in heroes) {
				hero = heroes[ids];
				hero.energy = random(1, 999);
				if (hero.hp > 0) {
					hero.hp = random(1, hero.hp);
				}
			}
		}
		fixBattle(r.progress[0].attackers.heroes);
		fixBattle(r.progress[0].defenders.heroes);
		endBattle(r, true);
	}

	function endBattle(battleResult, isCancal) {
		let calls = [{
			name: "clanRaid_endBossBattle",
			args: {
				result: battleResult.result,
				progress: battleResult.progress
			},
			ident: "body"
		}];

		send(JSON.stringify({calls}), e => {
			console.log(e);
			if (isCancal) {
				startBossBattle();
				return;
			}
			scriptMenu.setStatus('Босс пробит нанесен урон: ' + lastDamage);
			setTimeout(() => {
				scriptMenu.setStatus('');
			}, 5000);
			endBossBattle('Узпех!');
		});
	}

	/**
	 * Completing a task
	 *
	 * Завершение задачи
	 */
	function endBossBattle(reason, info) {
		isCancalBossBattle = true;
		console.log(reason, info);
		resolve();
	}
}

/**
 * Auto-repeat attack
 *
 * Автоповтор атаки
 */
function testAutoBattle() {
	return new Promise((resolve, reject) => {
		const bossBattle = new executeAutoBattle(resolve, reject);
		bossBattle.start(lastBattleArg, lastBattleInfo);
	});
}

/**
 * Auto-repeat attack
 *
 * Автоповтор атаки
 */
function executeAutoBattle(resolve, reject) {
	let battleArg = {};
	let countBattle = 0;
	let countMaxBattle = 10; //гудвин тест
	let findCoeff = 0;
	let lastCalcBattle = null;

	this.start = function (battleArgs, battleInfo) {
		battleArg = battleArgs;
		preCalcBattle(battleInfo);
	}
	/**
	 * Returns a promise for combat recalculation
	 *
	 * Возвращает промис для прерасчета боя
	 */
	function getBattleInfo(battle) {
		return new Promise(function (resolve) {
			battle.seed = Math.floor(Date.now() / 1000) + random(0, 1e3);
			Calc(battle).then(e => {
				e.coeff = calcCoeff(e, 'defenders');
				resolve(e);
			});
		});
	}
	/**
	 * Battle recalculation
	 *
	 * Прерасчет боя
	 */
	function preCalcBattle(battle) {
		let actions = [];
		const countTestBattle = getInput('countTestBattle');
		for (let i = 0; i < countTestBattle; i++) {
			actions.push(getBattleInfo(battle));
		}
		Promise.all(actions)
			.then(resultPreCalcBattle);
	}
	/**
	 * Processing the results of the battle recalculation
	 *
	 * Обработка результатов прерасчета боя
	 */
	async function resultPreCalcBattle(results) {
		let countWin = results.reduce((s, w) => w.result.win + s, 0);
		//скрыли прогресс тест
		setProgress(`${I18N('CHANCE_TO_WIN')} ${Math.floor(countWin / results.length * 100)}% (${results.length})`, false, hideProgress);
		if (countWin > 0) {
			isCancalBattle = false;
			startBattle();
			return;
		}
		let minCoeff = 100;
		let maxCoeff = -100;
		let avgCoeff = 0;
		results.forEach(e => {
			if (e.coeff < minCoeff) minCoeff = e.coeff;
			if (e.coeff > maxCoeff) maxCoeff = e.coeff;
			avgCoeff += e.coeff;
		});
		avgCoeff /= results.length;

		if (nameFuncStartBattle == 'invasion_bossStart' ||
			nameFuncStartBattle == 'bossAttack') {
			const result = await popup.confirm(
				I18N('BOSS_VICTORY_IMPOSSIBLE', { battles: results.length }), [
                { msg: I18N('BTN_CANCEL'), result: false, isCancel: true },
				{ msg: I18N('BTN_DO_IT'), result: true },
			])
			if (result) {
				isCancalBattle = false;
				startBattle();
				return;
			}
			setProgress(I18N('NOT_THIS_TIME'), true);
			endAutoBattle('invasion_bossStart');
			return;
		}

		const result = await popup.confirm(
			I18N('VICTORY_IMPOSSIBLE') +
			`<br>${I18N('ROUND_STAT')} ${results.length} ${I18N('BATTLE')}:` +
			`<br>${I18N('MINIMUM')}: ` + minCoeff.toLocaleString() +
			`<br>${I18N('MAXIMUM')}: ` + maxCoeff.toLocaleString() +
			`<br>${I18N('AVERAGE')}: ` + avgCoeff.toLocaleString() +
			`<br>${I18N('FIND_COEFF')} ` + avgCoeff.toLocaleString(), [
			{ msg: I18N('BTN_CANCEL'), result: 0, isCancel: true },
			{ msg: I18N('BTN_GO'), isInput: true, default: Math.round(avgCoeff * 1000) / 1000 },
		])
		if (result) {
			findCoeff = result;
			isCancalBattle = false;
			startBattle();
			return;
		}
		setProgress(I18N('NOT_THIS_TIME'), true);
		endAutoBattle(I18N('NOT_THIS_TIME'));
	}

	/**
	 * Calculation of the combat result coefficient
	 *
	 * Расчет коэфициента результата боя
	 */
	function calcCoeff(result, packType) {
		let beforeSumFactor = 0;
		const beforePack = result.battleData[packType][0];
		for (let heroId in beforePack) {
			const hero = beforePack[heroId];
			const state = hero.state;
			let factor = 1;
			if (state) {
				const hp = state.hp / state.maxHp;
				const energy = state.energy / 1e3;
				factor = hp + energy / 20;
			}
			beforeSumFactor += factor;
		}

		let afterSumFactor = 0;
		const afterPack = result.progress[0][packType].heroes;
		for (let heroId in afterPack) {
			const hero = afterPack[heroId];
			const stateHp = beforePack[heroId]?.state?.hp || beforePack[heroId]?.stats?.hp;
			const hp = hero.hp / stateHp;
			const energy = hero.energy / 1e3;
			const factor = hp + energy / 20;
			afterSumFactor += factor;
		}
		const resultCoeff = -(afterSumFactor - beforeSumFactor);
		return Math.round(resultCoeff * 1000) / 1000;
	}
	/**
	 * Start battle
	 *
	 * Начало боя
	 */
	function startBattle() {
		countBattle++;
		const countMaxBattle = getInput('countAutoBattle');
		setProgress(countBattle + '/' + countMaxBattle); //тест убрано, но у себя оставлю
		if (countBattle > countMaxBattle) {
			setProgress(`${I18N('RETRY_LIMIT_EXCEEDED')}: ${countMaxBattle}`, true);
			endAutoBattle(`${I18N('RETRY_LIMIT_EXCEEDED')}: ${countMaxBattle}`)
			return;
		}
		let calls = [{
			name: nameFuncStartBattle,
			args: battleArg,
			ident: "body"
		}];
		send(JSON.stringify({
			calls
		}), calcResultBattle);
	}
	/**
	 * Battle calculation
	 *
	 * Расчет боя
	 */
	async function calcResultBattle(e) {
		if ('error' in e) {
			const result = await popup.confirm(
				I18N('ERROR_DURING_THE_BATTLE'), [
				{ msg: I18N('BTN_OK'), result: false },
				{ msg: I18N('RELOAD_GAME'), result: true },
			]);
			endAutoBattle('Error', e.error);
			if (result) {
				location.reload();
			}
			return;
		}
		let battle = e.results[0].result.response.battle
		if (nameFuncStartBattle == 'towerStartBattle' ||
			nameFuncStartBattle == 'bossAttack' ||
			nameFuncStartBattle == 'invasion_bossStart') {
			battle = e.results[0].result.response;
		}
		lastCalcBattle = battle;
		BattleCalc(battle, getBattleType(battle.type), resultBattle);
	}
	/**
	 * Processing the results of the battle
	 *
	 * Обработка результатов боя
	 */
	function resultBattle(e) {
		const isWin = e.result.win;
		if (isWin) {
			endBattle(e, false);
			return;
		}
		const countMaxBattle = getInput('countAutoBattle');
		if (findCoeff) {
			const coeff = calcCoeff(e, 'defenders');
			setProgress(`${countBattle}/${countMaxBattle}, ${coeff}`);
			if (coeff > findCoeff) {
				endBattle(e, false);
				return;
			}
		} else {
			setProgress(`${countBattle}/${countMaxBattle}`);
 		}
		if (nameFuncStartBattle == 'towerStartBattle' ||
			nameFuncStartBattle == 'bossAttack' ||
			nameFuncStartBattle == 'invasion_bossStart') {
			startBattle();
			return;
		}
		cancelEndBattle(e);
	}
	/**
	 * Cancel fight
	 *
	 * Отмена боя
	 */
	function cancelEndBattle(r) {
		const fixBattle = function (heroes) {
			for (const ids in heroes) {
				hero = heroes[ids];
				hero.energy = random(1, 999);
				if (hero.hp > 0) {
					hero.hp = random(1, hero.hp);
				}
			}
		}
		fixBattle(r.progress[0].attackers.heroes);
		fixBattle(r.progress[0].defenders.heroes);
		endBattle(r, true);
	}
	/**
	 * End of the fight
	 *
	 * Завершение боя */
	function endBattle(battleResult, isCancal) {
		let calls = [{
			name: nameFuncEndBattle,
			args: {
				result: battleResult.result,
				progress: battleResult.progress
			},
			ident: "body"
		}];

		if (nameFuncStartBattle == 'invasion_bossStart') {
			calls[0].args.id = lastBattleArg.id;
		}

		send(JSON.stringify({
			calls
		}), async e => {
			console.log(e);
			if (isCancal) {
				startBattle();
				return;
			}
			setProgress(`${I18N('SUCCESS')}!`, 5000)
			if (nameFuncStartBattle == 'invasion_bossStart' ||
				nameFuncStartBattle == 'bossAttack') {
				const countMaxBattle = getInput('countAutoBattle');
				const bossLvl = lastCalcBattle.typeId >= 130 ? lastCalcBattle.typeId : '';
				const result = await popup.confirm(
					I18N('BOSS_HAS_BEEN_DEF_TEXT', { bossLvl, countBattle, countMaxBattle }), [
					{ msg: I18N('BTN_OK'), result: 0 },
					{ msg: I18N('MAKE_A_SYNC'), result: 1 },
					{ msg: I18N('RELOAD_GAME'), result: 2 },
				]);
				if (result) {
					if (result == 1) {
						cheats.refreshGame();
					}
					if (result == 2) {
						location.reload();
					}
				}

			}
			endAutoBattle(`${I18N('SUCCESS')}!`)
		});
	}
	/**
	 * Completing a task
	 *
	 * Завершение задачи
	 */
	function endAutoBattle(reason, info) {
		isCancalBattle = true;
		console.log(reason, info);
		resolve();
	}
}

function testDailyQuests() {
	return new Promise((resolve, reject) => {
		const quests = new dailyQuests(resolve, reject);
		quests.init(questsInfo);
		quests.start();
	});
}

/**
 * Automatic completion of daily quests
 *
 * Автоматическое выполнение ежедневных квестов
 */
class dailyQuests {
	/**
	 * Send(' {"calls":[{"name":"userGetInfo","args":{},"ident":"body"}]}').then(e => console.log(e))
	 * Send(' {"calls":[{"name":"heroGetAll","args":{},"ident":"body"}]}').then(e => console.log(e))
	 * Send(' {"calls":[{"name":"titanGetAll","args":{},"ident":"body"}]}').then(e => console.log(e))
	 * Send(' {"calls":[{"name":"inventoryGet","args":{},"ident":"body"}]}').then(e => console.log(e))
	 * Send(' {"calls":[{"name":"questGetAll","args":{},"ident":"body"}]}').then(e => console.log(e))
	 * Send(' {"calls":[{"name":"bossGetAll","args":{},"ident":"body"}]}').then(e => console.log(e))
	 */
	callsList = [
		"userGetInfo",
		"heroGetAll",
		"titanGetAll",
		"inventoryGet",
		"questGetAll",
		"bossGetAll",
	]

	dataQuests = {
		10001: {
			description: 'Улучши умения героев 3 раза', // ++++++++++++++++
			doItCall: () => {
				const upgradeSkills = this.getUpgradeSkills();
				return upgradeSkills.map(({ heroId, skill }, index) => ({ name: "heroUpgradeSkill", args: { heroId, skill }, "ident": `heroUpgradeSkill_${index}` }));
			},
			isWeCanDo: () => {
				const upgradeSkills = this.getUpgradeSkills();
				let sumGold = 0;
				for (const skill of upgradeSkills) {
					sumGold += this.skillCost(skill.value);
					if (!skill.heroId) {
						return false;
					}
				}
				return this.questInfo['userGetInfo'].gold > sumGold;
			},
		},
		10002: {
			description: 'Пройди 10 миссий', // --------------
			isWeCanDo: () => false,
		},
		10003: {
			description: 'Пройди 3 героические миссии', // --------------
			isWeCanDo: () => false,
		},
		10004: {
			description: 'Сразись 3 раза на Арене или Гранд Арене', // --------------
			isWeCanDo: () => false,
		},
		10006: {
			description: 'Используй обмен изумрудов 1 раз', // ++++++++++++++++
			doItCall: () => [{
				name: "refillableAlchemyUse",
				args: { multi: false },
				ident: "refillableAlchemyUse"
			}],
			isWeCanDo: () => {
				const starMoney = this.questInfo['userGetInfo'].starMoney;
				return starMoney >= 20;
			},
		},
		10007: {
			description: 'Соверши 1 призыв в Атриуме Душ', // ++++++++++++++++
		doItCall: () => [{ name: "gacha_open", args: { ident: "heroGacha", free: true, pack: false }, ident: "gacha_open" }],
			isWeCanDo: () => {
				const soulCrystal =  this.questInfo['inventoryGet'].coin[38];
				return soulCrystal > 0;
			},
		},
		10016: {
			description: 'Отправь подарки согильдийцам', // ++++++++++++++++
			doItCall: () => [{ name: "clanSendDailyGifts", args: {}, ident: "clanSendDailyGifts" }],
			isWeCanDo: () => true,
		},
		10018: {
			description: 'Используй зелье опыта', // ++++++++++++++++
			doItCall: () => {
				const expHero = this.getExpHero();
				return [{
					name: "consumableUseHeroXp",
					args: {
						heroId: expHero.heroId,
						libId: expHero.libId,
						amount: 1
					},
					ident: "consumableUseHeroXp"
				}];
			},
			isWeCanDo: () => {
				const expHero = this.getExpHero();
				return expHero.heroId && expHero.libId;
			},
		},
		10019: {
			description: 'Открой 1 сундук в Башне',
			doItFunc: testTower,
			isWeCanDo: () => false,
		},
		10020: {
			description: 'Открой 3 сундука в Запределье', // Готово
			doItCall: () => {
				return this.getOutlandChest();
			},
			isWeCanDo: () => {
				const outlandChest = this.getOutlandChest();
				return outlandChest.length > 0;
			},
		},
		10021: {
			description: 'Собери 75 Титанита в Подземелье Гильдии',
			isWeCanDo: () => false,
		},
		10022: {
			description: 'Собери 150 Титанита в Подземелье Гильдии',
			doItFunc: testDungeon,
			isWeCanDo: () => false,
		},
		10023: {
			description: 'Прокачай Дар Стихий на 1 уровень', // Готово
			doItCall: () => {
				const heroId = this.getHeroIdTitanGift();
				return [
					{ name: "heroTitanGiftLevelUp", args: { heroId }, ident: "heroTitanGiftLevelUp" },
					{ name: "heroTitanGiftDrop", args: { heroId }, ident: "heroTitanGiftDrop" }
				]
			},
			isWeCanDo: () => {
				const heroId = this.getHeroIdTitanGift();
				return heroId;
			},
		},
		10024: {
			description: 'Повысь уровень любого артефакта один раз', // Готово
			doItCall: () => {
				const upArtifact = this.getUpgradeArtifact();
				return [
					{
						name: "heroArtifactLevelUp",
						args: {
							heroId: upArtifact.heroId,
							slotId: upArtifact.slotId
						},
						ident: `heroArtifactLevelUp`
					}
				];
			},
			isWeCanDo: () => {
				const upgradeArtifact = this.getUpgradeArtifact();
				return upgradeArtifact.heroId;
			},
		},
		10025: {
			description: 'Начни 1 Экспедицию',
			doItFunc: checkExpedition,
			isWeCanDo: () => false,
		},
		10026: {
			description: 'Начни 4 Экспедиции', // --------------
			doItFunc: checkExpedition,
			isWeCanDo: () => false,
		},
		10027: {
			description: 'Победи в 1 бою Турнира Стихий',
			doItFunc: testTitanArena,
			isWeCanDo: () => false,
		},
		10028: {
			description: 'Повысь уровень любого артефакта титанов', // Готово
			doItCall: () => {
				const upTitanArtifact = this.getUpgradeTitanArtifact();
				return [
					{
						name: "titanArtifactLevelUp",
						args: {
							titanId: upTitanArtifact.titanId,
							slotId: upTitanArtifact.slotId
						},
						ident: `titanArtifactLevelUp`
					}
				];
			},
			isWeCanDo: () => {
				const upgradeTitanArtifact = this.getUpgradeTitanArtifact();
				return upgradeTitanArtifact.titanId;
			},
		},
		10029: {
			description: 'Открой сферу артефактов титанов', // ++++++++++++++++
			doItCall: () => [{ name: "titanArtifactChestOpen", args: { amount: 1, free: true }, ident: "titanArtifactChestOpen" }],
			isWeCanDo: () => {
				return this.questInfo['inventoryGet']?.consumable[55] > 0
			},
		},
		10030: {
			description: 'Улучши облик любого героя 1 раз', // Готово
			doItCall: () => {
				const upSkin = this.getUpgradeSkin();
				return [
					{
						name: "heroSkinUpgrade",
						args: {
							heroId: upSkin.heroId,
							skinId: upSkin.skinId
						},
						ident: `heroSkinUpgrade`
					}
				];
			},
			isWeCanDo: () => {
				const upgradeSkin = this.getUpgradeSkin();
				return upgradeSkin.heroId;
			},
		},
		10031: {
			description: 'Победи в 6 боях Турнира Стихий', // --------------
			doItFunc: testTitanArena,
			isWeCanDo: () => false,
		},
		10043: {
			description: 'Начни или присоеденись к Приключению', // --------------
			isWeCanDo: () => false,
		},
		10044: {
			description: 'Воспользуйся призывом питомцев 1 раз', // ++++++++++++++++
			doItCall: () => [{ name: "pet_chestOpen", args: { amount: 1, paid: false }, ident: "pet_chestOpen" }],
			isWeCanDo: () => {
				return this.questInfo['inventoryGet']?.consumable[90] > 0
			},
		},
		10046: {
			/**
			 * TODO: Watch Adventure
			 * TODO: Смотреть приключение
			 */
			description: 'Открой 3 сундука в Приключениях',
			isWeCanDo: () => false,
		},
		10047: {
			description: 'Набери 150 очков активности в Гильдии', // Готово
			doItCall: () => {
				const enchantRune = this.getEnchantRune();
				return [
					{
						name: "heroEnchantRune",
						args: {
							heroId: enchantRune.heroId,
							tier: enchantRune.tier,
							items: {
								consumable: { [enchantRune.itemId]: 1 }
							}
						},
						ident: `heroEnchantRune`
					}
				];
			},
			isWeCanDo: () => {
				const userInfo = this.questInfo['userGetInfo'];
				const enchantRune = this.getEnchantRune();
				return enchantRune.heroId && userInfo.gold > 1e3;
			},
		},
	};

	constructor(resolve, reject, questInfo) {
		this.resolve = resolve;
		this.reject = reject;
	}

	init(questInfo) {
		this.questInfo = questInfo;
		this.isAuto = false;
	}

	async autoInit(isAuto) {
		this.isAuto = isAuto || false;
		const quests = {};
		const calls = this.callsList.map(name => ({
			name, args: {}, ident: name
		}))
		const result = await Send(JSON.stringify({ calls })).then(e => e.results);
		for (const call of result) {
			quests[call.ident] = call.result.response;
		}
		this.questInfo = quests;
	}

	async start() {
		/**
		 * TODO may not be needed
		 *
		 * TODO возожно не нужна
		 */
		let countQuest = 0;
		const weCanDo = [];
		const selectedActions = getSaveVal('selectedActions', {});
		for (let quest of this.questInfo['questGetAll']) {
			if (quest.id in this.dataQuests && quest.state == 1) {
				if (!selectedActions[quest.id]) {
					selectedActions[quest.id] = {
						checked: false
					}
				}

				const isWeCanDo = this.dataQuests[quest.id].isWeCanDo;
				if (!isWeCanDo.call(this)) {
					continue;
				}

				weCanDo.push({
					name: quest.id,
					label: I18N(`QUEST_${quest.id}`),
					checked: selectedActions[quest.id].checked
				});
				countQuest++;
			}
		}

		if (!weCanDo.length) {
			this.end(I18N('NOTHING_TO_DO'));
			return;
		}

		console.log(weCanDo);
		let taskList = [];
		if (this.isAuto) {
			taskList = weCanDo;
		} else {
			const answer = await popup.confirm(`${I18N('YOU_CAN_COMPLETE') }:`, [
				{ msg: I18N('BTN_DO_IT'), result: true },
				{ msg: I18N('BTN_CANCEL'), result: false, isCancel: true },
			], weCanDo);
			if (!answer) {
				this.end('');
				return;
			}
			taskList = popup.getCheckBoxes();
			taskList.forEach(e => {
				selectedActions[e.name].checked = e.checked;
			});
			setSaveVal('selectedActions', selectedActions);
		}

		const calls = [];
		let countChecked = 0;
		for (const task of taskList) {
			if (task.checked) {
				countChecked++;
				const quest = this.dataQuests[task.name]
				console.log(quest.description);

				if (quest.doItCall) {
					const doItCall = quest.doItCall.call(this);
					calls.push(...doItCall);
				}
			}
		}

		if (!countChecked) {
			this.end(I18N('NOT_QUEST_COMPLETED'));
			return;
		}

		const result = await Send(JSON.stringify({ calls }));
		if (result.error) {
			console.error(result.error, result.error.call)
		}
		this.end(`${I18N('COMPLETED_QUESTS')}: ${countChecked}`);
	}

	errorHandling(error) {
		//console.error(error);
		let errorInfo = error.toString() + '\n';
		try {
			const errorStack = error.stack.split('\n');
			const endStack = errorStack.map(e => e.split('@')[0]).indexOf("testDoYourBest");
			errorInfo += errorStack.slice(0, endStack).join('\n');
		} catch (e) {
			errorInfo += error.stack;
		}
		copyText(errorInfo);
	}

	skillCost(lvl) {
		return 573 * lvl ** 0.9 + lvl ** 2.379;
	}

	getUpgradeSkills() {
		const heroes = Object.values(this.questInfo['heroGetAll']);
		const upgradeSkills = [
			{ heroId: 0, slotId: 0, value: 130 },
			{ heroId: 0, slotId: 0, value: 130 },
			{ heroId: 0, slotId: 0, value: 130 },
		];
		const skillLib = lib.getData('skill');
		/**
		 * color - 1 (белый) открывает 1 навык
		 * color - 2 (зеленый) открывает 2 навык
		 * color - 4 (синий) открывает 3 навык
		 * color - 7 (фиолетовый) открывает 4 навык
		 */
		const colors = [1, 2, 4, 7];
		for (const hero of heroes) {
			const level = hero.level;
			const color = hero.color;
			for (let skillId in hero.skills) {
				const tier = skillLib[skillId].tier;
				const sVal = hero.skills[skillId];
				if (color < colors[tier] || tier < 1 || tier > 4) {
					continue;
				}
				for (let upSkill of upgradeSkills) {
					if (sVal < upSkill.value && sVal < level) {
						upSkill.value = sVal;
						upSkill.heroId = hero.id;
						upSkill.skill = tier;
						break;
					}
				}
			}
		}
		return upgradeSkills;
	}

	getUpgradeArtifact() {
		const heroes = Object.values(this.questInfo['heroGetAll']);
		const inventory = this.questInfo['inventoryGet'];
		const upArt = { heroId: 0, slotId: 0, level: 100 };

		const heroLib = lib.getData('hero');
		const artifactLib = lib.getData('artifact');

		for (const hero of heroes) {
			const heroInfo = heroLib[hero.id];
			const level = hero.level
			if (level < 20) {
				continue;
			}

			for (let slotId in hero.artifacts) {
				const art = hero.artifacts[slotId];
				/* Текущая звезданость арта */
				const star = art.star;
				if (!star) {
					continue;
				}
				/* Текущий уровень арта */
				const level = art.level;
				if (level >= 100) {
					continue;
				}
				/* Идентификатор арта в библиотеке */
				const artifactId = heroInfo.artifacts[slotId];
				const artInfo = artifactLib.id[artifactId];
				const costNextLevel = artifactLib.type[artInfo.type].levels[level + 1].cost;

				const costСurrency = Object.keys(costNextLevel).pop();
				const costValues = Object.entries(costNextLevel[costСurrency]).pop();
				const costId = costValues[0];
				const costValue = +costValues[1];

				/** TODO: Возможно стоит искать самый высокий уровень который можно качнуть? */
				if (level < upArt.level && inventory[costСurrency][costId] >= costValue) {
					upArt.level = level;
					upArt.heroId = hero.id;
					upArt.slotId = slotId;
				}
			}
		}
		return upArt;
	}

	getUpgradeSkin() {
		const heroes = Object.values(this.questInfo['heroGetAll']);
		const inventory = this.questInfo['inventoryGet'];
		const upSkin = { heroId: 0, skinId: 0, level: 60, cost: 1500 };

		const skinLib = lib.getData('skin');

		for (const hero of heroes) {
			const level = hero.level
			if (level < 20) {
				continue;
			}

			for (let skinId in hero.skins) {
				/* Текущий уровень скина */
				const level = hero.skins[skinId];
				if (level >= 60) {
					continue;
				}
				/* Идентификатор скина в библиотеке */
				const skinInfo = skinLib[skinId];
				const costNextLevel = skinInfo.statData.levels[level + 1].cost;

				const costСurrency = Object.keys(costNextLevel).pop();
				const costСurrencyId = Object.keys(costNextLevel[costСurrency]).pop();
				const costValue = +costNextLevel[costСurrency][costСurrencyId];

				/** TODO: Возможно стоит искать самый высокий уровень который можно качнуть? */
				if (level < upSkin.level &&
					costValue < upSkin.cost &&
					inventory[costСurrency][costСurrencyId] >= costValue) {
					upSkin.cost = costValue;
					upSkin.level = level;
					upSkin.heroId = hero.id;
					upSkin.skinId = skinId;
				}
			}
		}
		return upSkin;
	}

	getUpgradeTitanArtifact() {
		const titans = Object.values(this.questInfo['titanGetAll']);
		const inventory = this.questInfo['inventoryGet'];
		const userInfo = this.questInfo['userGetInfo'];
		const upArt = { titanId: 0, slotId: 0, level: 120 };

		const titanLib = lib.getData('titan');
		const artTitanLib = lib.getData('titanArtifact');

		for (const titan of titans) {
			const titanInfo = titanLib[titan.id];
			// const level = titan.level
			// if (level < 20) {
			// 	continue;
			// }

			for (let slotId in titan.artifacts) {
				const art = titan.artifacts[slotId];
				/* Текущая звезданость арта */
				const star = art.star;
				if (!star) {
					continue;
				}
				/* Текущий уровень арта */
				const level = art.level;
				if (level >= 120) {
					continue;
				}
				/* Идентификатор арта в библиотеке */
				const artifactId = titanInfo.artifacts[slotId];
				const artInfo = artTitanLib.id[artifactId];
				const costNextLevel = artTitanLib.type[artInfo.type].levels[level + 1].cost;

				const costСurrency = Object.keys(costNextLevel).pop();
				let costValue = 0;
				let currentValue = 0;
				if (costСurrency == 'gold') {
					costValue = costNextLevel[costСurrency];
					currentValue = userInfo.gold;
				} else {
					const costValues = Object.entries(costNextLevel[costСurrency]).pop();
					const costId = costValues[0];
					costValue = +costValues[1];
					currentValue = inventory[costСurrency][costId];
				}

				/** TODO: Возможно стоит искать самый высокий уровень который можно качнуть? */
				if (level < upArt.level && currentValue >= costValue) {
					upArt.level = level;
					upArt.titanId = titan.id;
					upArt.slotId = slotId;
					break;
				}
			}
		}
		return upArt;
	}

	getEnchantRune() {
		const heroes = Object.values(this.questInfo['heroGetAll']);
		const inventory = this.questInfo['inventoryGet'];
		const enchRune = { heroId: 0, tier: 0, exp: 43750, itemId: 0 };
		for (let i = 1; i <= 4; i++) {
			if (inventory.consumable[i] > 0) {
				enchRune.itemId = i;
				break;
			}
			return enchRune;
		}

		const runeLib = lib.getData('rune');
		const runeLvls = Object.values(runeLib.level);
		/**
		 * color - 4 (синий) открывает 1 и 2 символ
		 * color - 7 (фиолетовый) открывает 3 символ
		 * color - 8 (фиолетовый +1) открывает 4 символ
		 * color - 9 (фиолетовый +2) открывает 5 символ
		 */
		// TODO: кажется надо учесть уровень команды
		const colors = [4, 4, 7, 8, 9];
		for (const hero of heroes) {
			const color = hero.color;


			for (let runeTier in hero.runes) {
				/* Проверка на доступность руны */
				if (color < colors[runeTier]) {
					continue;
				}
				/* Текущий опыт руны */
				const exp = hero.runes[runeTier];
				if (exp >= 43750) {
					continue;
				}

				let level = 0;
				if (exp) {
					for (let lvl of runeLvls) {
						if (exp >= lvl.enchantValue) {
							level = lvl.level;
						} else {
							break;
						}
					}
				}
				/** Уровень героя необходимый для уровня руны */
				const heroLevel = runeLib.level[level].heroLevel;
				if (hero.level < heroLevel) {
					continue;
				}

				/** TODO: Возможно стоит искать самый высокий уровень который можно качнуть? */
				if (exp < enchRune.exp) {
					enchRune.exp = exp;
					enchRune.heroId = hero.id;
					enchRune.tier = runeTier;
					break;
				}
			}
		}
		return enchRune;
	}

	getOutlandChest() {
		const bosses = this.questInfo['bossGetAll'];

		const calls = [];

		for (let boss of bosses) {
			if (boss.mayRaid) {
				calls.push({
					name: "bossRaid",
					args: {
						bossId: boss.id
					},
					ident: "bossRaid_" + boss.id
				});
				calls.push({
					name: "bossOpenChest",
					args: {
						bossId: boss.id,
						amount: 1,
						starmoney: 0
					},
					ident: "bossOpenChest_" + boss.id
				});
			} else if (boss.chestId == 1) {
				calls.push({
					name: "bossOpenChest",
					args: {
						bossId: boss.id,
						amount: 1,
						starmoney: 0
					},
					ident: "bossOpenChest_" + boss.id
				});
			}
		}

		return calls;
	}

	getExpHero() {
		const heroes = Object.values(this.questInfo['heroGetAll']);
		const inventory = this.questInfo['inventoryGet'];
		const expHero = { heroId: 0, exp: 3625195, libId: 0 };
		/** зелья опыта (consumable 9, 10, 11, 12) */
		for (let i = 9; i <= 12; i++) {
			if (inventory.consumable[i]) {
				expHero.libId = i;
				break;
			}
		}

		for (const hero of heroes) {
			const exp = hero.xp;
			if (exp < expHero.exp) {
				expHero.heroId = hero.id;
			}
		}
		return expHero;
	}

	getHeroIdTitanGift() {
		const heroes = Object.values(this.questInfo['heroGetAll']);
		const inventory = this.questInfo['inventoryGet'];
		const user = this.questInfo['userGetInfo'];
		const titanGiftLib = lib.getData('titanGift');
		/** Искры */
		const titanGift = inventory.consumable[24];
		let heroId = 0;
		let minLevel = 30;

		if (titanGift < 250 || user.gold < 7000) {
			return 0;
		}

		for (const hero of heroes) {
			if (hero.titanGiftLevel >= 30) {
				continue;
			}

			if (!hero.titanGiftLevel) {
				return hero.id;
			}

			const cost = titanGiftLib[hero.titanGiftLevel].cost;
			if (minLevel > hero.titanGiftLevel &&
				titanGift >= cost.consumable[24] &&
				user.gold >= cost.gold
			) {
				minLevel = hero.titanGiftLevel;
				heroId = hero.id;
			}
		}

		return heroId;
	}

	end(status) {
		setProgress(status, true);
		this.resolve();
	}
}

this.questRun = dailyQuests;

function testDoYourBest() {
	return new Promise((resolve, reject) => {
		const doIt = new doYourBest(resolve, reject);
		doIt.start();
	});
}

/**
 * Do everything button
 *
 * Кнопка сделать все
 */
class doYourBest {

	funcList = [
	    //собрать запределье
		{
			name: 'getOutland',
			label: I18N('ASSEMBLE_OUTLAND'),
			checked: false
		},
		//пройти башню
		{
			name: 'testTower',
			label: I18N('PASS_THE_TOWER'),
			checked: false
		},
		//экспедиции
		{
			name: 'checkExpedition',
			label: I18N('CHECK_EXPEDITIONS'),
			checked: false
		},
		//турнир стихий
		{
			name: 'testTitanArena',
			label: I18N('COMPLETE_TOE'),
			checked: false
		},
		//собрать почту
		{
			name: 'mailGetAll',
			label: I18N('COLLECT_MAIL'),
			checked: false
		},
		//Собрать всякую херню
		{
			name: 'collectAllStuff',
			label: I18N('COLLECT_MISC'),
			title: I18N('COLLECT_MISC_TITLE'),
			checked: false
		},
		//ежедневная награда
		{
			name: 'getDailyBonus',
			label: I18N('DAILY_BONUS'),
			checked: false
		},
		//ежедневные квесты удалить наверно есть в настройках
		/*{
			name: 'dailyQuests',
			label: I18N('DO_DAILY_QUESTS'),
			checked: false
		},*/
		//Провидец
		{
			name: 'rollAscension',
			label: I18N('SEER_TITLE'),
			checked: false
		},
		//собрать награды за квесты
		{
			name: 'questAllFarm',
			label: I18N('COLLECT_QUEST_REWARDS'),
			checked: false
		},
		// тест отправь подарки согильдийцам
        {
            name: 'testclanSendDailyGifts',
            label: I18N('QUEST_10016'),
            checked: false
        },
        //собрать новогодние подарки
        {
			name: 'getGiftNewYear',
			label: I18N('NY_GIFTS'),
            checked: false
		},
        // тест сферу титанов
        {
            name: 'testtitanArtifactChestOpen',
            label: I18N('QUEST_10029'),
            checked: false
        },
        // тест призыв петов
        {
            name: 'testpet_chestOpen',
            label: I18N('QUEST_10044'),
            checked: false
        },
		//пройти подземелье обычное
		{
			name: 'testDungeon',
			label: I18N('COMPLETE_DUNGEON'),
			checked: false
		},
        //пройти подземелье для фуловых титанов
		{
			name: 'DungeonFull',
			label: I18N('COMPLETE_DUNGEON_FULL'),
			checked: false
		},
		//синхронизация
		{
			name: 'synchronization',
			label: I18N('MAKE_A_SYNC'),
			checked: false
		},
		//перезагрузка
		{
			name: 'reloadGame',
			label: I18N('RELOAD_GAME'),
			checked: false
		},
	];

	functions = {
		getOutland,//собрать запределье
		testTower,//прохождение башни
		checkExpedition,//автоэкспедиции
		testTitanArena,//Автопрохождение Турнира Стихий
		mailGetAll,//Собрать всю почту, кроме писем с энергией и зарядами портала
		//Собрать пасхалки, камни облика, ключи, монеты арены и Хрусталь души
		collectAllStuff: async () => {
			await offerFarmAllReward();
			await Send('{"calls":[{"name":"subscriptionFarm","args":{},"ident":"body"},{"name":"zeppelinGiftFarm","args":{},"ident":"zeppelinGiftFarm"},{"name":"grandFarmCoins","args":{},"ident":"grandFarmCoins"},{"name":"gacha_refill","args":{"ident":"heroGacha"},"ident":"gacha_refill"}]}');
		},
		//Выполнять ежедневные квесты
		dailyQuests: async function () {
			const quests = new dailyQuests(() => { }, () => { });
			await quests.autoInit(true);
			await quests.start();
		},
		rollAscension,//провидец
		getDailyBonus,//ежедневная награда
		questAllFarm,//Собрать все награды за задания
		testclanSendDailyGifts, //отправить подарки
        getGiftNewYear,//собрать новогодние подарки
		testtitanArtifactChestOpen, //открой сферу титанов
		testpet_chestOpen, //Воспользуйся призывом питомцев 1 раз
		testDungeon,//подземка обычная
        DungeonFull,//подземка для фуловых титанов
		synchronization: async () => {
			cheats.refreshGame();
		},
		reloadGame: async () => {
			location.reload();
		}
	}

	constructor(resolve, reject, questInfo) {
		this.resolve = resolve;
		this.reject = reject;
		this.questInfo = questInfo
	}

	async start() {
		const selectedDoIt = getSaveVal('selectedDoIt', {});

		this.funcList.forEach(task => {
			if (!selectedDoIt[task.name]) {
				selectedDoIt[task.name] = {
					checked: task.checked
				}
			} else {
				task.checked = selectedDoIt[task.name].checked
			}
		});

		const answer = await popup.confirm(I18N('RUN_FUNCTION'), [
			{ msg: I18N('BTN_CANCEL'), result: false, isCancel: true },
			{ msg: I18N('BTN_GO'), result: true },
		], this.funcList);

		if (!answer) {
			this.end('');
			return;
		}

		const taskList = popup.getCheckBoxes();
		taskList.forEach(task => {
			selectedDoIt[task.name].checked = task.checked;
		});
		setSaveVal('selectedDoIt', selectedDoIt);
		for (const task of popup.getCheckBoxes()) {
			if (task.checked) {
				try {
					setProgress(`${task.label} <br>${I18N('PERFORMED')}!`);
					await this.functions[task.name]();
					setProgress(`${task.label} <br>${I18N('DONE')}!`);
				} catch (error) {
					if (await popup.confirm(`${I18N('ERRORS_OCCURRES')}:<br> ${task.label} <br>${I18N('COPY_ERROR')}?`, [
						{ msg: I18N('BTN_NO'), result: false },
						{ msg: I18N('BTN_YES'), result: true },
					])) {
						this.errorHandling(error);
					}
				}
			}
		}
		setTimeout((msg) => {
			this.end(msg);
		}, 2000, I18N('ALL_TASK_COMPLETED'));
		return;
	}

	errorHandling(error) {
		//console.error(error);
		let errorInfo = error.toString() + '\n';
		try {
			const errorStack = error.stack.split('\n');
			const endStack = errorStack.map(e => e.split('@')[0]).indexOf("testDoYourBest");
			errorInfo += errorStack.slice(0, endStack).join('\n');
		} catch (e) {
			errorInfo += error.stack;
		}
		copyText(errorInfo);
	}

	end(status) {
		setProgress(status, true);
		this.resolve();
	}
}

/**
 * Passing the adventure along the specified route
 *
 * Прохождение приключения по указанному маршруту
 */
function testAdventure(type) {
	return new Promise((resolve, reject) => {
		const bossBattle = new executeAdventure(resolve, reject);
		bossBattle.start(type);
	});
}

function testAdventure2(solo) {
	return new Promise((resolve, reject) => {
		const bossBattle = new executeAdventure(resolve, reject);
		bossBattle.start(solo);
	});
}

/**
 * Passing the adventure along the specified route
 *
 * Прохождение приключения по указанному маршруту
 */
class executeAdventure {

	type = 'default';

	actions = {
		default: {
			getInfo: "adventure_getInfo",
			startBattle: 'adventure_turnStartBattle',
			endBattle: 'adventure_endBattle',
			collectBuff: 'adventure_turnCollectBuff'
		},
		solo: {
			getInfo: "adventureSolo_getInfo",
			startBattle: 'adventureSolo_turnStartBattle',
			endBattle: 'adventureSolo_endBattle',
			collectBuff: 'adventureSolo_turnCollectBuff'
		}
	}

	terminatеReason = I18N('UNKNOWN');
	callAdventureInfo = {
		name: "adventure_getInfo",
		args: {},
		ident: "adventure_getInfo"
	}
	callTeamGetAll = {
		name: "teamGetAll",
		args: {},
		ident: "teamGetAll"
	}
	callTeamGetFavor = {
		name: "teamGetFavor",
		args: {},
		ident: "teamGetFavor"
	}
	//тест прикла
		defaultWays = {
			//Галахад, 1-я
            "adv_strongford_2pl_easy": {
                first: '1,2,3,5,6',
                second: '1,2,4,7,6',
                third: '1,2,3,5,6'
            },
			//Джинджер, 2-я
            "adv_valley_3pl_easy": {
                first: '1,2,5,8,9,11',
                second: '1,3,6,9,11',
                third: '1,4,7,10,9,11'
            },
			//Орион, 3-я
            "adv_ghirwil_3pl_easy": {
                first: '1,5,6,9,11',
                second: '1,4,12,13,11',
                third: '1,2,3,7,10,11'
            },
			//Тесак, 4-я
            "adv_angels_3pl_easy_fire": {
                first: '1,2,4,7,18,8,12,19,22,23',
                second: '1,3,6,11,17,10,16,21,22,23',
                third: '1,5,24,25,9,14,15,20,22,23'
            },
			//Галахад, 5-я
            "adv_strongford_3pl_normal_2": {
                first: '1,2,7,8,12,16,23,26,25,21,24',
                second: '1,4,6,10,11,15,22,15,19,18,24',
                third: '1,5,9,10,14,17,20,27,25,21,24'
            },
			//Джинджер, 6-я
            "adv_valley_3pl_normal": {
                first: '1,2,4,7,10,13,16,19,24,22,25',
                second: '1,3,6,9,12,15,18,21,26,23,25',
                third: '1,5,7,8,11,14,17,20,22,25'
            },
			//Орион, 7-я
            "adv_ghirwil_3pl_normal_2": {
                first: '1,11,10,11,12,15,12,11,21,25,27',
                second: '1,7,3,4,3,6,13,19,20,24,27',
                third: '1,8,5,9,16,23,22,26,27'
            },
			//Тесак, 8-я
            "adv_angels_3pl_normal": {
                first: '1,3,4,8,7,9,10,13,17,16,20,22,23,31,32',
                second: '1,3,5,7,8,11,14,18,20,22,24,27,30,26,32',
                third: '1,3,2,6,7,9,11,15,19,20,22,21,28,29,25'
            },
			//Галахад, 9-я
            "adv_strongford_3pl_hard_2": {
                first: '1,2,6,10,15,20,14,29,25,36,39,42,44,45',
                second: '1,3,8,12,11,7,16,21,26,30,31,32,35,37,40,45',
                third: '1,3,4,13,19,18,23,17,22,38,41,43,46,45'
            },
            //Джинджер, 10-я
            "adv_valley_3pl_hard": {
                first: '1,3,2,6,11,17,25,30,35,34,29,24,21,17,12,7',
                second: '1,4,8,13,18,22,26,31,36,40,45,44,43,38,33,28',
                third: '1,5,9,14,19,23,27,32,37,42,48,51,50,49,46,52'
            },
            //Орион, 11-я
            "adv_ghirwil_3pl_hard": {
                first: '1,2,3,6,7,12,11,15,21,27,36,39,40,41,37',
                second: '1,2,4,6,8,12,17,18,19,25,31,30,29,28,22,16',
                third: '1,2,5,6,9,13,14,20,26,32,38,35,33,34,37'
            },
            //Тесак, 12-я
            "adv_angels_3pl_hard": {
                first: '1,9,3,6,10,22,31,36,35,29,34,30,21,13',
                second: '1,5,12,15,28,20,12,14,26,18,19,20,27',
                third: '1,8,2,4,7,16,23,32,33,25,24,17,11'
            },
            //Тесак, 13-12
            "adv_angels_3pl_hell": {
                first: '1,7,11,17,24,14,26,18,12,15,28,20,19,18,27',
                second: '1,2,4,6,16,23,33,34,25,32,29,30,21,13',
                third: '1,8,1,9,3,5,10,22,31,36,35'
            },
            //Галахад, 13-9
            "adv_strongford_3pl_hell": {
                first: '1,2,6,12,15,20,14,24,29,25,35,38,41,43,44',
                second: '1,3,8,9,13,7,16,21,26,30,31,42,34,36,39,44',
                third: '1,3,4,10,19,18,23,17,22,37,40,32,45,44'
            },
            //Орион, 13-11
            "adv_ghirwil_3pl_hell": {
                first: '1,2,3,6,7,12,11,15,21,27,36,39,40,41,37',
                second: '1,2,4,6,8,12,17,18,19,25,31,30,29,28,22,16',
                third: '1,2,5,6,9,13,14,20,26,32,38,35,33,34,37'
            },
            //Джинджер, 13-10
            "adv_valley_3pl_hell": {
                first: '1,3,2,6,11,17,25,30,35,34,29,24,21,17,12,7',
                second: '1,4,8,13,18,22,26,31,36,40,45,44,43,38,33,28',
                third: '1,5,9,14,19,23,27,32,37,42,48,51,50,49,46,52'
            },
			 //Буря, 061123
            "tempest_3_3": {
                first: '1,5,1,5,11,17,25,30,35,34,29,24,21,17,12,7',
                //second: '1,4,8,13,18,22,26,31,36,40,45,44,43,38,33,28',
                //third: '1,5,9,14,19,23,27,32,37,42,48,51,50,49,46,52'
            }
        }
	callStartBattle = {
		name: "adventure_turnStartBattle",
		args: {},
		ident: "body"
	}
	callEndBattle = {
		name: "adventure_endBattle",
		args: {
			result: {},
			progress: {},
		},
		ident: "body"
	}
	callCollectBuff = {
		name: "adventure_turnCollectBuff",
		args: {},
		ident: "body"
	}

	constructor(resolve, reject) {
		this.resolve = resolve;
		this.reject = reject;
	}

	async start(type) {
		/*this.type = type || this.type;
		this.path = await this.getPath();
		if (!this.path) {
			this.end();
			return;
		}
		this.callAdventureInfo.name = this.actions[this.type].getInfo;
		*/
		const data = await Send(JSON.stringify({
			calls: [
				this.callAdventureInfo,
				this.callTeamGetAll,
				this.callTeamGetFavor
			]
		}));
		//тест прикла1
			this.path = await this.getPath(data.results[0].result.response.mapIdent);
			if (!this.path) {
				this.end();
				return;
			}
		return this.checkAdventureInfo(data.results);
	}

	async getPath(mapId) {
		//const answer = await popup.confirm(I18N('ENTER_THE_PATH'), [
			/*{
				msg: I18N('START_ADVENTURE'),
				placeholder: '1,2,3,4,5,6',
				isInput: true,
				default: getSaveVal('adventurePath', '')
			},*/
			//тест
			const answer = await popup.confirm('Введите путь приключения через запятые', [
			    {
					msg: 'Начать приключение по этому пути!',
					placeholder: '1,2,3,4,5,6,7',
					isInput: true,
					default: getSaveVal('adventurePath', '')
				},
				{
					msg: '              Начать по пути №1!              ',
					placeholder: '1,2,3',
					isInput: true,
					default: this.defaultWays[mapId]?.first
				},
				{
					msg: '              Начать по пути №2!              ',
					placeholder: '1,2,3',
					isInput: true,
					default: this.defaultWays[mapId]?.second
				},
				{
					msg: '              Начать по пути №3!              ',
					placeholder: '1,2,3',
					isInput: true,
					default: this.defaultWays[mapId]?.third
				},
			{
				msg: I18N('BTN_CANCEL'),
				result: false
			},
		]);
		if (!answer) {
			this.terminatеReason = I18N('BTN_CANCELED');
			return false;
		}
		//тест запятые или дефисы
		let path = answer.split(',');
		if (path.length < 2) {
			path = answer.split('-');
		}
		if (path.length < 2) {
			this.terminatеReason = I18N('MUST_TWO_POINTS');
			return false;
		}

		for (let p in path) {
			path[p] = +path[p].trim()
			if (Number.isNaN(path[p])) {
				this.terminatеReason = I18N('MUST_ONLY_NUMBERS');
				return false;
			}
		}
		/*if (!this.checkPath(path)) {
			return false;
		}*/ //тест новое
		setSaveVal('adventurePath', answer);
		return path;
	}
/*
	checkPath() {
		for (let i = 0; i < this.path.length - 1; i++) {
			const currentPoint = this.path[i];
			const nextPoint = this.path[i + 1];

			const isValidPath = this.paths.some(p =>
				(p.from_id === currentPoint && p.to_id === nextPoint) ||
				(p.from_id === nextPoint && p.to_id === currentPoint)
			);

			if (!isValidPath) {
				this.terminatеReason = I18N('INCORRECT_WAY', {
					from: currentPoint,
					to: nextPoint,
				});
				return false;
			}
		}

		return true;
	}
*/
	async checkAdventureInfo(data) {
		this.advInfo = data[0].result.response;
		if (!this.advInfo) {
			this.terminatеReason = I18N('NOT_ON_AN_ADVENTURE') ;
			return this.end();
		}
		const heroesTeam = data[1].result.response.adventure_hero;
		const favor = data[2]?.result.response.adventure_hero;
		const heroes = heroesTeam.slice(0, 5);
		const pet = heroesTeam[5];
		this.args = {
			pet,
			heroes,
			favor,
			path: [],
			broadcast: false
		}
		const advUserInfo = this.advInfo.users[userInfo.id];
		this.turnsLeft = advUserInfo.turnsLeft;
		this.currentNode = advUserInfo.currentNode;
		this.nodes = this.advInfo.nodes;
		//this.paths = this.advInfo.paths;
		//this.mapIdent = this.advInfo.mapIdent;//новое
/*
		this.path = await this.getPath(); //новое
		if (!this.path) {
			return this.end();
		}*/

		if (this.currentNode == 1 && this.path[0] != 1) {
			this.path.unshift(1);
		}

		return this.loop();
	}

	async loop() {
		const position = this.path.indexOf(+this.currentNode);
		if (!(~position)) {
			this.terminatеReason = I18N('YOU_IN_NOT_ON_THE_WAY');
			return this.end();
		}
		this.path = this.path.slice(position);
		if ((this.path.length - 1) > this.turnsLeft &&
			await popup.confirm(I18N('ATTEMPTS_NOT_ENOUGH'), [
				{ msg: I18N('YES_CONTINUE'), result: false },
				{ msg: I18N('BTN_NO'), result: true },
			])) {
			this.terminatеReason = I18N('NOT_ENOUGH_AP');
			return this.end();
		}
		const toPath = [];
		for (const nodeId of this.path) {
			if (!this.turnsLeft) {
				this.terminatеReason = I18N('ATTEMPTS_ARE_OVER');
				return this.end();
			}
			toPath.push(nodeId);
			console.log(toPath);
			if (toPath.length > 1) {
				setProgress(toPath.join(' > ') + ` ${I18N('MOVES')}: ` + this.turnsLeft);
			}
			if (nodeId == this.currentNode) {
				continue;
			}

			const nodeInfo = this.getNodeInfo(nodeId);
			if (nodeInfo.type == 'TYPE_COMBAT') {
				if (nodeInfo.state == 'empty') {
					this.turnsLeft--;
					continue;
				}

				/**
				 * Disable regular battle cancellation
				 *
				 * Отключаем штатную отменую боя
				 */
				isCancalBattle = false;
				if (await this.battle(toPath)) {
					this.turnsLeft--;
					toPath.splice(0, toPath.indexOf(nodeId));
					nodeInfo.state = 'empty';
					isCancalBattle = true;
					continue;
				}
				isCancalBattle = true;
				return this.end()
			}

			if (nodeInfo.type == 'TYPE_PLAYERBUFF') {
				const buff = this.checkBuff(nodeInfo);
				if (buff == null) {
					continue;
				}

				if (await this.collectBuff(buff, toPath)) {
					this.turnsLeft--;
					toPath.splice(0, toPath.indexOf(nodeId));
					continue;
				}
				this.terminatеReason = I18N('BUFF_GET_ERROR');
				return this.end();
			}
		}
		this.terminatеReason = I18N('SUCCESS');
		return this.end();
	}

	/**
	 * Carrying out a fight
	 *
	 * Проведение боя
	 */
	async battle(path, preCalc = true) {
		const data = await this.startBattle(path);
		try {
			const battle = data.results[0].result.response.battle;
			const result = await Calc(battle);
			if (result.result.win) {
				const info = await this.endBattle(result);
				if (info.results[0].result.response?.error) {
					this.terminatеReason = I18N('BATTLE_END_ERROR');
					return false;
				}
			} else {
				await this.cancelBattle(result);

				if (preCalc && await this.preCalcBattle(battle)) {
					path = path.slice(-2);
					for (let i = 1; i <= getInput('countAutoBattle'); i++) {
						setProgress(`${I18N('AUTOBOT')}: ${i}/${getInput('countAutoBattle')}`);
						const result = await this.battle(path, false);
						if (result) {
							setProgress(I18N('VICTORY'));
							return true;
						}
					}
					this.terminatеReason = I18N('FAILED_TO_WIN_AUTO');
					return false;
				}
				return false;
			}
		} catch (error) {
			console.error(error);
			if (await popup.confirm(I18N('ERROR_OF_THE_BATTLE_COPY'), [
				{ msg: I18N('BTN_NO'), result: false },
				{ msg: I18N('BTN_YES'), result: true },
			])) {
				this.errorHandling(error, data);
			}
			this.terminatеReason = I18N('ERROR_DURING_THE_BATTLE');
			return false;
		}
		return true;
	}

	/**
	 * Recalculate battles
	 *
	 * Прерасчтет битвы
	 */
	async preCalcBattle(battle) {
		const countTestBattle = getInput('countTestBattle');
		for (let i = 0; i < countTestBattle; i++) {
			battle.seed = Math.floor(Date.now() / 1000) + random(0, 1e3);
			const result = await Calc(battle);
			if (result.result.win) {
				console.log(i, countTestBattle);
				return true;
			}
		}
		this.terminatеReason = I18N('NO_CHANCE_WIN') + countTestBattle;
		return false;
	}
	/**
	 * Starts a fight
	 *
	 * Начинает бой
	 */
	startBattle(path) {
		this.args.path = path;
		this.callStartBattle.name = this.actions[this.type].startBattle;
		this.callStartBattle.args = this.args
		const calls = [this.callStartBattle];
		return Send(JSON.stringify({ calls }));
	}

	cancelBattle(battle) {
		const fixBattle = function (heroes) {
			for (const ids in heroes) {
				const hero = heroes[ids];
				hero.energy = random(1, 999);
				if (hero.hp > 0) {
					hero.hp = random(1, hero.hp);
				}
			}
		}
		fixBattle(battle.progress[0].attackers.heroes);
		fixBattle(battle.progress[0].defenders.heroes);
		return this.endBattle(battle);
	}

	/**
	 * Ends the fight
	 *
	 * Заканчивает бой
	 */
	endBattle(battle) {
		this.callEndBattle.name = this.actions[this.type].endBattle;
		this.callEndBattle.args.result = battle.result
		this.callEndBattle.args.progress = battle.progress
		const calls = [this.callEndBattle];
		return Send(JSON.stringify({ calls }));
	}

	/**
	 * Checks if you can get a buff
	 *
	 * Проверяет можно ли получить баф
	 */
	checkBuff(nodeInfo) {
		let id = null;
		let value = 0;
		for (const buffId in nodeInfo.buffs) {
			const buff = nodeInfo.buffs[buffId];
			if (buff.owner == null && buff.value > value) {
				id = buffId;
				value = buff.value;
			}
		}
		nodeInfo.buffs[id].owner = 'Я';
		return id;
	}

	/**
	 * Collects a buff
	 *
	 * Собирает баф
	 */
	async collectBuff(buff, path) {
		this.callCollectBuff.name = this.actions[this.type].collectBuff;
		this.callCollectBuff.args = { buff, path };
		const calls = [this.callCollectBuff];
		return Send(JSON.stringify({ calls }));
	}

	getNodeInfo(nodeId) {
		return this.nodes.find(node => node.id == nodeId);
	}

	errorHandling(error, data) {
		//console.error(error);
		let errorInfo = error.toString() + '\n';
		try {
			const errorStack = error.stack.split('\n');
			const endStack = errorStack.map(e => e.split('@')[0]).indexOf("testAdventure");
			errorInfo += errorStack.slice(0, endStack).join('\n');
		} catch (e) {
			errorInfo += error.stack;
		}
		if (data) {
			errorInfo += '\nData: ' + JSON.stringify(data);
		}
		copyText(errorInfo);
	}

	end() {
		isCancalBattle = true;
		setProgress(this.terminatеReason, true);
		console.log(this.terminatеReason);
		this.resolve();
	}
}

class executeAdventure2 {

	type = 'default';

	actions = {
		default: {
			getInfo: "adventure_getInfo",
			startBattle: 'adventure_turnStartBattle',
			endBattle: 'adventure_endBattle',
			collectBuff: 'adventure_turnCollectBuff'
		},
		solo: {
			getInfo: "adventureSolo_getInfo",
			startBattle: 'adventureSolo_turnStartBattle',
			endBattle: 'adventureSolo_endBattle',
			collectBuff: 'adventureSolo_turnCollectBuff'
		}
	}

	terminatеReason = I18N('UNKNOWN');
	callAdventureInfo = {
		name: "adventure_getInfo",
		args: {},
		ident: "adventure_getInfo"
	}
	callTeamGetAll = {
		name: "teamGetAll",
		args: {},
		ident: "teamGetAll"
	}
	callTeamGetFavor = {
		name: "teamGetFavor",
		args: {},
		ident: "teamGetFavor"
	}
	callStartBattle = {
		name: "adventure_turnStartBattle",
		args: {},
		ident: "body"
	}
	callEndBattle = {
		name: "adventure_endBattle",
		args: {
			result: {},
			progress: {},
		},
		ident: "body"
	}
	callCollectBuff = {
		name: "adventure_turnCollectBuff",
		args: {},
		ident: "body"
	}

	constructor(resolve, reject) {
		this.resolve = resolve;
		this.reject = reject;
	}

	async start(type) {
		this.type = type || this.type;
		this.callAdventureInfo.name = this.actions[this.type].getInfo;
		const data = await Send(JSON.stringify({
			calls: [
				this.callAdventureInfo,
				this.callTeamGetAll,
				this.callTeamGetFavor
			]
		}));
		return this.checkAdventureInfo(data.results);
	}

	async getPath() {
		const oldVal = getSaveVal('adventurePath', '');
		const keyPath = `adventurePath:${this.mapIdent}`;
		const answer = await popup.confirm(I18N('ENTER_THE_PATH'), [
			{
				msg: I18N('START_ADVENTURE'),
				placeholder: '1,2,3,4,5,6',
				isInput: true,
				default: getSaveVal(keyPath, oldVal)
			},
			{
				msg: I18N('BTN_CANCEL'),
				result: false,
				isCancel: true
			},
		]);
		if (!answer) {
			this.terminatеReason = I18N('BTN_CANCELED');
			return false;
		}

		let path = answer.split(',');
		if (path.length < 2) {
			path = answer.split('-');
		}
		if (path.length < 2) {
			this.terminatеReason = I18N('MUST_TWO_POINTS');
			return false;
		}

		for (let p in path) {
			path[p] = +path[p].trim()
			if (Number.isNaN(path[p])) {
				this.terminatеReason = I18N('MUST_ONLY_NUMBERS');
				return false;
			}
		}
		if (!this.checkPath(path)) {
			return false;
		}
		setSaveVal(keyPath, answer);
		return path;
	}

	checkPath(path) {
		for (let i = 0; i < path.length - 1; i++) {
			const currentPoint = path[i];
			const nextPoint = path[i + 1];

			const isValidPath = this.paths.some(p =>
				(p.from_id === currentPoint && p.to_id === nextPoint) ||
				(p.from_id === nextPoint && p.to_id === currentPoint)
			);

			if (!isValidPath) {
				this.terminatеReason = I18N('INCORRECT_WAY', {
					from: currentPoint,
					to: nextPoint,
				});
				return false;
			}
		}

		return true;
	}

	async checkAdventureInfo(data) {
		this.advInfo = data[0].result.response;
		if (!this.advInfo) {
			this.terminatеReason = I18N('NOT_ON_AN_ADVENTURE') ;
			return this.end();
		}
		const heroesTeam = data[1].result.response.adventure_hero;
		const favor = data[2]?.result.response.adventure_hero;
		const heroes = heroesTeam.slice(0, 5);
		const pet = heroesTeam[5];
		this.args = {
			pet,
			heroes,
			favor,
			path: [],
			broadcast: false
		}
		const advUserInfo = this.advInfo.users[userInfo.id];
		this.turnsLeft = advUserInfo.turnsLeft;
		this.currentNode = advUserInfo.currentNode;
		this.nodes = this.advInfo.nodes;
		this.paths = this.advInfo.paths;
		this.mapIdent = this.advInfo.mapIdent;

		this.path = await this.getPath();
		if (!this.path) {
			return this.end();
		}

		if (this.currentNode == 1 && this.path[0] != 1) {
			this.path.unshift(1);
		}

		return this.loop();
	}

	async loop() {
		const position = this.path.indexOf(+this.currentNode);
		if (!(~position)) {
			this.terminatеReason = I18N('YOU_IN_NOT_ON_THE_WAY');
			return this.end();
		}
		this.path = this.path.slice(position);
		if ((this.path.length - 1) > this.turnsLeft &&
			await popup.confirm(I18N('ATTEMPTS_NOT_ENOUGH'), [
				{ msg: I18N('YES_CONTINUE'), result: false },
				{ msg: I18N('BTN_NO'), result: true },
			])) {
			this.terminatеReason = I18N('NOT_ENOUGH_AP');
			return this.end();
		}
		const toPath = [];
		for (const nodeId of this.path) {
			if (!this.turnsLeft) {
				this.terminatеReason = I18N('ATTEMPTS_ARE_OVER');
				return this.end();
			}
			toPath.push(nodeId);
			console.log(toPath);
			if (toPath.length > 1) {
				setProgress(toPath.join(' > ') + ` ${I18N('MOVES')}: ` + this.turnsLeft);
			}
			if (nodeId == this.currentNode) {
				continue;
			}

			const nodeInfo = this.getNodeInfo(nodeId);
			if (nodeInfo.type == 'TYPE_COMBAT') {
				if (nodeInfo.state == 'empty') {
					this.turnsLeft--;
					continue;
				}

				/**
				 * Disable regular battle cancellation
				 *
				 * Отключаем штатную отменую боя
				 */
				isCancalBattle = false;
				if (await this.battle(toPath)) {
					this.turnsLeft--;
					toPath.splice(0, toPath.indexOf(nodeId));
					nodeInfo.state = 'empty';
					isCancalBattle = true;
					continue;
				}
				isCancalBattle = true;
				return this.end()
			}

			if (nodeInfo.type == 'TYPE_PLAYERBUFF') {
				const buff = this.checkBuff(nodeInfo);
				if (buff == null) {
					continue;
				}

				if (await this.collectBuff(buff, toPath)) {
					this.turnsLeft--;
					toPath.splice(0, toPath.indexOf(nodeId));
					continue;
				}
				this.terminatеReason = I18N('BUFF_GET_ERROR');
				return this.end();
			}
		}
		this.terminatеReason = I18N('SUCCESS');
		return this.end();
	}

	/**
	 * Carrying out a fight
	 *
	 * Проведение боя
	 */
	async battle(path, preCalc = true) {
		const data = await this.startBattle(path);
		try {
			const battle = data.results[0].result.response.battle;
			const result = await Calc(battle);
			if (result.result.win) {
				const info = await this.endBattle(result);
				if (info.results[0].result.response?.error) {
					this.terminatеReason = I18N('BATTLE_END_ERROR');
					return false;
				}
			} else {
				await this.cancelBattle(result);

				if (preCalc && await this.preCalcBattle(battle)) {
					path = path.slice(-2);
					for (let i = 1; i <= getInput('countAutoBattle'); i++) {
						setProgress(`${I18N('AUTOBOT')}: ${i}/${getInput('countAutoBattle')}`);
						const result = await this.battle(path, false);
						if (result) {
							setProgress(I18N('VICTORY'));
							return true;
						}
					}
					this.terminatеReason = I18N('FAILED_TO_WIN_AUTO');
					return false;
				}
				return false;
			}
		} catch (error) {
			console.error(error);
			if (await popup.confirm(I18N('ERROR_OF_THE_BATTLE_COPY'), [
				{ msg: I18N('BTN_NO'), result: false },
				{ msg: I18N('BTN_YES'), result: true },
			])) {
				this.errorHandling(error, data);
			}
			this.terminatеReason = I18N('ERROR_DURING_THE_BATTLE');
			return false;
		}
		return true;
	}

	/**
	 * Recalculate battles
	 *
	 * Прерасчтет битвы
	 */
	async preCalcBattle(battle) {
		const countTestBattle = getInput('countTestBattle');
		for (let i = 0; i < countTestBattle; i++) {
			battle.seed = Math.floor(Date.now() / 1000) + random(0, 1e3);
			const result = await Calc(battle);
			if (result.result.win) {
				console.log(i, countTestBattle);
				return true;
			}
		}
		this.terminatеReason = I18N('NO_CHANCE_WIN') + countTestBattle;
		return false;
	}

	/**
	 * Starts a fight
	 *
	 * Начинает бой
	 */
	startBattle(path) {
		this.args.path = path;
		this.callStartBattle.name = this.actions[this.type].startBattle;
		this.callStartBattle.args = this.args
		const calls = [this.callStartBattle];
		return Send(JSON.stringify({ calls }));
	}

	cancelBattle(battle) {
		const fixBattle = function (heroes) {
			for (const ids in heroes) {
				const hero = heroes[ids];
				hero.energy = random(1, 999);
				if (hero.hp > 0) {
					hero.hp = random(1, hero.hp);
				}
			}
		}
		fixBattle(battle.progress[0].attackers.heroes);
		fixBattle(battle.progress[0].defenders.heroes);
		return this.endBattle(battle);
	}

	/**
	 * Ends the fight
	 *
	 * Заканчивает бой
	 */
	endBattle(battle) {
		this.callEndBattle.name = this.actions[this.type].endBattle;
		this.callEndBattle.args.result = battle.result
		this.callEndBattle.args.progress = battle.progress
		const calls = [this.callEndBattle];
		return Send(JSON.stringify({ calls }));
	}

	/**
	 * Checks if you can get a buff
	 *
	 * Проверяет можно ли получить баф
	 */
	checkBuff(nodeInfo) {
		let id = null;
		let value = 0;
		for (const buffId in nodeInfo.buffs) {
			const buff = nodeInfo.buffs[buffId];
			if (buff.owner == null && buff.value > value) {
				id = buffId;
				value = buff.value;
			}
		}
		nodeInfo.buffs[id].owner = 'Я';
		return id;
	}

	/**
	 * Collects a buff
	 *
	 * Собирает баф
	 */
	async collectBuff(buff, path) {
		this.callCollectBuff.name = this.actions[this.type].collectBuff;
		this.callCollectBuff.args = { buff, path };
		const calls = [this.callCollectBuff];
		return Send(JSON.stringify({ calls }));
	}

	getNodeInfo(nodeId) {
		return this.nodes.find(node => node.id == nodeId);
	}

	errorHandling(error, data) {
		//console.error(error);
		let errorInfo = error.toString() + '\n';
		try {
			const errorStack = error.stack.split('\n');
			const endStack = errorStack.map(e => e.split('@')[0]).indexOf("testAdventure");
			errorInfo += errorStack.slice(0, endStack).join('\n');
		} catch (e) {
			errorInfo += error.stack;
		}
		if (data) {
			errorInfo += '\nData: ' + JSON.stringify(data);
		}
		copyText(errorInfo);
	}

	end() {
		isCancalBattle = true;
		setProgress(this.terminatеReason, true);
		console.log(this.terminatеReason);
		this.resolve();
	}
}
/**
 * Passage of brawls
 *
 * Прохождение потасовок
 */
function testBrawls() {
	return new Promise((resolve, reject) => {
		const brawls = new executeBrawls(resolve, reject);
		brawls.start(brawlsPack);
	});
}
/**
 * Passage of brawls
 *
 * Прохождение потасовок
 */
class executeBrawls {
	callBrawlQuestGetInfo = {
		name: "brawl_questGetInfo",
		args: {},
		ident: "brawl_questGetInfo"
	}
	callBrawlFindEnemies = {
		name: "brawl_findEnemies",
		args: {},
		ident: "brawl_findEnemies"
	}
	callBrawlQuestFarm = {
		name: "brawl_questFarm",
		args: {},
		ident: "brawl_questFarm"
	}
	callUserGetInfo = {
		name: "userGetInfo",
		args: {},
		ident: "userGetInfo"
	}

	stats = {
		win: 0,
		loss: 0,
		count: 0,
	}

	stage = {
		'3': 1,
		'7': 2,
		'12': 3,
	}

	attempts = 0;

	constructor(resolve, reject) {
		this.resolve = resolve;
		this.reject = reject;
	}

	async start(args) {
		this.args = args;
		isCancalBattle = false;
		this.brawlInfo = await this.getBrawlInfo();
		this.attempts = this.brawlInfo.attempts;

		if (!this.attempts) {
			this.end(I18N('DONT_HAVE_LIVES'))
			return;
		}

		while (1) {
			if (!isBrawlsAutoStart) {
				this.end(I18N('BTN_CANCELED'))
				return;
			}

			const maxStage = this.brawlInfo.questInfo.stage;
			const stage = this.stage[maxStage];
			const progress = this.brawlInfo.questInfo.progress;

			setProgress(`${I18N('STAGE')} ${stage}: ${progress}/${maxStage}<br>${I18N('FIGHTS')}: ${this.stats.count}<br>${I18N('WINS')}: ${this.stats.win}<br>${I18N('LOSSES')}: ${this.stats.loss}<br>${I18N('LIVES')}: ${this.attempts}<br>${I18N('STOP')}`, false, function () {
				isBrawlsAutoStart = false;
			});

			if (this.brawlInfo.questInfo.canFarm) {
				const result = await this.questFarm();
				console.log(result);
			}

			if (this.brawlInfo.questInfo.stage == 12 && this.brawlInfo.questInfo.progress == 12) {
				this.end(I18N('SUCCESS'))
				return;
			}

			if (!this.attempts) {
				this.end(I18N('DONT_HAVE_LIVES'))
				return;
			}

			const enemie = Object.values(this.brawlInfo.findEnemies).shift();

			const result = await this.battle(enemie.userId);
			this.brawlInfo = {
				questInfo: result[1].result.response,
				findEnemies: result[2].result.response,
			}
		}
	}

	async questFarm() {
		const calls = [this.callBrawlQuestFarm];
		const result = await Send(JSON.stringify({ calls }));
		return result.results[0].result.response;
	}

	async getBrawlInfo() {
		const data = await Send(JSON.stringify({
			calls: [
				this.callUserGetInfo,
				this.callBrawlQuestGetInfo,
				this.callBrawlFindEnemies,
			]
		}));

		let attempts = data.results[0].result.response.refillable.find(n => n.id == 48);
		return {
			attempts: attempts.amount,
			questInfo: data.results[1].result.response,
			findEnemies: data.results[2].result.response,
		}
	}

	/**
	 * Carrying out a fight
	 *
	 * Проведение боя
	 */
	async battle(userId) {
		this.stats.count++;
		const battle = await this.startBattle(userId, this.args);
		const result = await Calc(battle);
		console.log(result.result);
		if (result.result.win) {
			this.stats.win++;
		} else {
			this.stats.loss++;
			this.attempts--;
		}
		return await this.endBattle(result);
		// return await this.cancelBattle(result);
	}

	/**
	 * Starts a fight
	 *
	 * Начинает бой
	 */
	async startBattle(userId, args) {
		const call = {
			name: "brawl_startBattle",
			args,
			ident: "brawl_startBattle"
		}
		call.args.userId = userId;
		const calls = [call];
		const result = await Send(JSON.stringify({ calls }));
		return result.results[0].result.response;
	}

	cancelBattle(battle) {
		const fixBattle = function (heroes) {
			for (const ids in heroes) {
				const hero = heroes[ids];
				hero.energy = random(1, 999);
				if (hero.hp > 0) {
					hero.hp = random(1, hero.hp);
				}
			}
		}
		fixBattle(battle.progress[0].attackers.heroes);
		fixBattle(battle.progress[0].defenders.heroes);
		return this.endBattle(battle);
	}

	/**
	 * Ends the fight
	 *
	 * Заканчивает бой
	 */
	async endBattle(battle) {
		battle.progress[0].attackers.input = ['auto', 0, 0, 'auto', 0, 0];
		const calls = [{
			name: "brawl_endBattle",
			args: {
				result: battle.result,
				progress: battle.progress
			},
			ident: "brawl_endBattle"
		},
		this.callBrawlQuestGetInfo,
		this.callBrawlFindEnemies,
		];
		const result = await Send(JSON.stringify({ calls }));
		return result.results;
	}

	end(endReason) {
		isCancalBattle = true;
		isBrawlsAutoStart = false;
		setProgress(endReason, true);
		console.log(endReason);
		this.resolve();
	}
}

class executeEventAutoBoss {

	async start() {
		await this.loadInfo();
		this.generateCombo();

		const countTestBattle = +getInput('countTestBattle');
		const maxCalcBattle = this.combo.length * countTestBattle;

		const resultDialog = await popup.confirm(I18N('EVENT_AUTO_BOSS', {
			length: this.combo.length,
			countTestBattle,
			maxCalcBattle
		}), [
			{ msg: I18N('BEST_SLOW'), result: true },
			{ msg: I18N('FIRST_FAST'), result: false },
			{ isClose: true, result: 'exit' },
		]);

		if (resultDialog == 'exit') {
			this.end('Отменено');
			return;
		}

		popup.confirm(I18N('FREEZE_INTERFACE'));

		setTimeout(() => {
			this.startFindPack(resultDialog)
		}, 1000)
	}

	async loadInfo() {
		const resultReq = await Send({ calls: [{ name: "teamGetMaxUpgrade", args: {}, ident: "group_1_body" }, { name: "invasion_bossStart", args: { id: 119, heroes: [3, 61], favor: { "61": 6001 } }, ident: "body" }] }).then(e => e.results);
		this.heroes = resultReq[0].result.response;
		this.battle = resultReq[1].result.response;

		this.heroes.hero[61] = this.battle.attackers[1];
		this.battle.attackers = [];
	}

	combinations(arr, n) {
		if (n == 1) {
			return arr.map(function (x) { return [x]; });
		}
		else if (n <= 0) {
			return [];
		}
		var result = [];
		for (var i = 0; i < arr.length; i++) {
			var rest = arr.slice(i + 1);
			var c = this.combinations(rest, n - 1);
			for (var j = 0; j < c.length; j++) {
				c[j].unshift(arr[i]);
				result.push(c[j]);
			}
		}
		return result;
	}

	generateCombo() {
		// const heroesIds = [3, 7, 8, 9, 12, 16, 18, 22, 35, 40, 48, 57, 58, 59];
		const heroesIds = [3, 7, 9, 12, 18, 22, 35, 40, 48, 57, 58, 59];
		this.combo = this.combinations(heroesIds, 4);
	}

	async startFindPack(findBestOfAll) {
		const promises = [];
		let bestBattle = null;
		for (const comb of this.combo) {
			const copyBattle = structuredClone(this.battle);
			const attackers = [];
			for (const id of comb) {
				if (this.heroes.hero[id]) {
					attackers.push(this.heroes.hero[id]);
				}
			}
			attackers.push(this.heroes.hero[61]);
			attackers.push(this.heroes.pet[6001]);
			copyBattle.attackers = attackers;
			const countTestBattle = +getInput('countTestBattle');
			if (findBestOfAll) {
				promises.push(this.CalcBattle(copyBattle, countTestBattle));
			} else {
				try {
					const checkBattle = await this.CalcBattle(copyBattle, countTestBattle);
					if (checkBattle.result.win) {
						bestBattle = checkBattle;
						break;
					}
				} catch(e) {
					console.log(e, copyBattle)
					popup.confirm(I18N('ERROR_F12'));
					this.end(I18N('ERROR_F12'), e, copyBattle)
					return;
				}
			}
		}

		if (findBestOfAll) {
			bestBattle = await Promise.all(promises)
				.then(results => {
					results = results.sort((a, b) => b.coeff - a.coeff).slice(0, 10);
					let maxStars = 0;
					let maxCoeff = -100;
					let maxBattle = null;
					results.forEach(e => {
						if (e.stars > maxStars || e.coeff > maxCoeff) {
							maxCoeff = e.coeff;
							maxStars = e.stars;
							maxBattle = e;
						}
					});
					console.log(results);
					console.log('better', maxCoeff, maxStars, maxBattle, maxBattle.battleData.attackers.map(e => e.id));
					return maxBattle;
				});
		}

		if (!bestBattle || !bestBattle.result.win) {
			let msg = I18N('FAILED_FIND_WIN_PACK');
			let msgc = msg;
			if (bestBattle?.battleData) {
				const heroes = bestBattle.battleData.attackers.map(e => e.id).filter(e => e < 61);
				msg += `</br>${I18N('BEST_PACK')}</br>` + heroes.map(
					id => `<img src="https://heroesweb-a.akamaihd.net/vk/v0952/assets/hero_icons/${('000' + id).slice(-4)}.png"/>`
				).join('');
				msgc += I18N('BEST_PACK') + heroes.join(',')
			}

			await popup.confirm(msg);
			this.end(msgc);
			return;
		}

		this.heroesPack = bestBattle.battleData.attackers.map(e => e.id).filter(e => e < 6000);
		this.battleLoop();
	}

	async battleLoop() {
		let repeat = false;
		do {
			repeat = false;
			const countAutoBattle = +getInput('countAutoBattle');
			for (let i = 1; i <= countAutoBattle; i++) {
				const startBattle = await Send({
					calls: [{
						name: "invasion_bossStart",
						args: {
							id: 119,
							heroes: this.heroesPack,
							favor: { "61": 6001 },
							pet: 6001
						}, ident: "body"
					}]
				}).then(e => e.results[0].result.response);
				const calcBattle = await Calc(startBattle);

				setProgress(`${i}) ${calcBattle.result.win ? I18N('VICTORY') : I18N('DEFEAT') } `)
				console.log(i, calcBattle.result.win)
				if (!calcBattle.result.win) {
					continue;
				}

				const endBattle = await Send({
					calls: [{
						name: "invasion_bossEnd",
						args: {
							id: 119,
							result: calcBattle.result,
							progress: calcBattle.progress
						}, ident: "body"
					}]
				}).then(e => e.results[0].result.response);
				console.log(endBattle);
				const msg = I18N('BOSS_HAS_BEEN_DEF', { bossLvl: this.battle.typeId });
				await popup.confirm(msg);
				this.end(msg);
				return;
			}

			const msg = I18N('NOT_ENOUGH_ATTEMPTS_BOSS', { bossLvl: this.battle.typeId });
			repeat = await popup.confirm(msg, [
				{ msg: 'Да', result: true },
				{ msg: 'Нет', result: false },
			]);
			this.end(I18N('NOT_ENOUGH_ATTEMPTS_BOSS', { bossLvl: this.battle.typeId }));

		} while (repeat)
	}

	calcCoeff(result, packType) {
		let beforeSumFactor = 0;
		const beforePack = result.battleData[packType][0];
		for (let heroId in beforePack) {
			const hero = beforePack[heroId];
			const state = hero.state;
			let factor = 1;
			if (state) {
				const hp = state.hp / state.maxHp;
				factor = hp;
			}
			beforeSumFactor += factor;
		}

		let afterSumFactor = 0;
		const afterPack = result.progress[0][packType].heroes;
		for (let heroId in afterPack) {
			const hero = afterPack[heroId];
			const stateHp = beforePack[heroId]?.state?.hp || beforePack[heroId]?.stats?.hp;
			const hp = hero.hp / stateHp;
			afterSumFactor += hp;
		}
		const resultCoeff = beforeSumFactor / afterSumFactor;
		return resultCoeff;
	}

	async CalcBattle(battle, count) {
		const actions = [];
		for (let i = 0; i < count; i++) {
			battle.seed = Math.floor(Date.now() / 1000) + this.random(0, 1e3);
			actions.push(Calc(battle).then(e => {
				e.coeff = this.calcCoeff(e, 'defenders');
				return e;
			}));
		}

		return Promise.all(actions).then(results => {
			let maxCoeff = -100;
			let maxBattle = null;
			results.forEach(e => {
				if (e.coeff > maxCoeff) {
					maxCoeff = e.coeff;
					maxBattle = e;
				}
			});
			maxBattle.stars = results.reduce((w, s) => w + s.result.stars, 0);
			maxBattle.attempts = results;
			return maxBattle;
		});
	}

	random(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	end(reason) {
		setProgress('');
		console.log('endEventAutoBoss', reason)
	}
}

// подземку вконце впихнул
function DungeonFull() {
		return new Promise((resolve, reject) => {
			const dung = new executeDungeon2(resolve, reject);
			const titanit = getInput('countTitanit');
			dung.start(titanit);
		});
	}
/** Прохождение подземелья */
function executeDungeon2(resolve, reject) {
        let dungeonActivity = 0;
        let startDungeonActivity = 0;
		let maxDungeonActivity = 150;
		let limitDungeonActivity = 30180;
        let countShowStats = 1;
		//let fastMode = isChecked('fastMode');
		let end = false;

        let countTeam = [];
        let timeDungeon = {
			all: new Date().getTime(),
			findAttack: 0,
			attackNeutral: 0,
			attackEarthOrFire: 0
		}

		let titansStates = {};
        let bestBattle = {};

		let teams = {
			neutral: [],
			water: [],
			earth: [],
			fire: [],
			hero: []
		}

		let callsExecuteDungeon = {
			calls: [{
				name: "dungeonGetInfo",
				args: {},
				ident: "dungeonGetInfo"
			}, {
				name: "teamGetAll",
				args: {},
				ident: "teamGetAll"
			}, {
				name: "teamGetFavor",
				args: {},
				ident: "teamGetFavor"
			}, {
				name: "clanGetInfo",
				args: {},
				ident: "clanGetInfo"
			}]
		}

		this.start = async function(titanit) {
			//maxDungeonActivity = titanit > limitDungeonActivity ? limitDungeonActivity : titanit;
            maxDungeonActivity = titanit || getInput('countTitanit');
			send(JSON.stringify(callsExecuteDungeon), startDungeon);
		}

		/** Получаем данные по подземелью */
		function startDungeon(e) {
            stopDung = false; // стоп подземка
			let res = e.results;
			let dungeonGetInfo = res[0].result.response;
			if (!dungeonGetInfo) {
				endDungeon('noDungeon', res);
				return;
			}
            console.log("Начинаем копать на фулл: ", new Date());
			let teamGetAll = res[1].result.response;
			let teamGetFavor = res[2].result.response;
			dungeonActivity = res[3].result.response.stat.todayDungeonActivity;
            startDungeonActivity = res[3].result.response.stat.todayDungeonActivity;
			titansStates = dungeonGetInfo.states.titans;

			teams.hero = {
				favor: teamGetFavor.dungeon_hero,
				heroes: teamGetAll.dungeon_hero.filter(id => id < 6000),
				teamNum: 0,
			}
			let heroPet = teamGetAll.dungeon_hero.filter(id => id >= 6000).pop();
			if (heroPet) {
				teams.hero.pet = heroPet;
			}
			teams.neutral = getTitanTeam('neutral');
			teams.water = {
				favor: {},
				heroes: getTitanTeam('water'),
				teamNum: 0,
			};
			teams.earth = {
				favor: {},
				heroes: getTitanTeam('earth'),
				teamNum: 0,
			};
			teams.fire = {
				favor: {},
				heroes: getTitanTeam('fire'),
				teamNum: 0,
			};

			checkFloor(dungeonGetInfo);
		}

		function getTitanTeam(type) {
			switch (type) {
				case 'neutral':
					return [4023, 4022, 4012, 4021, 4011, 4010, 4020];
				case 'water':
					return [4000, 4001, 4002, 4003]
                        .filter(e => !titansStates[e]?.isDead);
				case 'earth':
					return [4020, 4022, 4021, 4023]
                        .filter(e => !titansStates[e]?.isDead);
				case 'fire':
					return [4010, 4011, 4012, 4013]
                        .filter(e => !titansStates[e]?.isDead);
			}
		}

		/** Создать копию объекта */
		function clone(a) {
            return JSON.parse(JSON.stringify(a));
		}

		/** Находит стихию на этаже */
        function findElement(floor, element) {
            for (let i in floor) {
                if (floor[i].attackerType === element) {
                    return i;
                }
            }
            return undefined;
        }

		/** Проверяем этаж */
		async function checkFloor(dungeonInfo) {
			if (!('floor' in dungeonInfo) || dungeonInfo.floor?.state == 2) {
				saveProgress();
				return;
			}
			// console.log(dungeonInfo, dungeonActivity);
			setProgress(`${I18N('DUNGEON2')}: ${I18N('TITANIT')} ${dungeonActivity}/${maxDungeonActivity}`);
			//setProgress('Dungeon: Титанит ' + dungeonActivity + '/' + maxDungeonActivity);
			if (dungeonActivity >= maxDungeonActivity) {
				endDungeon('Стоп подземка,', 'набрано титанита: ' + dungeonActivity + '/' + maxDungeonActivity);
                return;
			}
            let activity = dungeonActivity - startDungeonActivity;
			titansStates = dungeonInfo.states.titans;
            if (stopDung){
				endDungeon('Стоп подземка,', 'набрано титанита: ' + dungeonActivity + '/' + maxDungeonActivity);
                return;
            }
            /*if (activity / 1000 > countShowStats) {
                countShowStats++;
                showStats();
            }*/
            bestBattle = {};
			let floorChoices = dungeonInfo.floor.userData;
            if (floorChoices.length > 1) {
                for (let element in teams) {
                    let teamNum = findElement(floorChoices, element);
                    if (!!teamNum) {
                        if (element == 'earth') {
                            teamNum = await chooseEarthOrFire(floorChoices);
                            if (teamNum < 0) {
                                endDungeon('Невозможно победить без потери Титана!', dungeonInfo);
                                return;
                            }
                        }
                        chooseElement(floorChoices[teamNum].attackerType, teamNum);
                        return;
                    }
                }
            } else {
                chooseElement(floorChoices[0].attackerType, 0);
            }
        }

		/** Выбираем огнем или землей атаковать */
		async function chooseEarthOrFire(floorChoices) {
            bestBattle.recovery = -11;
            let selectedTeamNum = -1;
            for (let attempt = 0; selectedTeamNum < 0 && attempt < 4; attempt++) {
                for (let teamNum in floorChoices) {
                    let attackerType = floorChoices[teamNum].attackerType;
                    selectedTeamNum = await attemptAttackEarthOrFire(teamNum, attackerType, attempt);
                }
            }
            console.log("Выбор команды огня или земли: ", selectedTeamNum < 0 ? "не сделан" : floorChoices[selectedTeamNum].attackerType);
            return selectedTeamNum;
		}

		/** Попытка атаки землей и огнем */
		async function attemptAttackEarthOrFire(teamNum, attackerType, attempt) {
            let start = new Date();
            let team = clone(teams[attackerType]);
            let startIndex = team.heroes.length + attempt - 4;
            if (startIndex >= 0) {
                team.heroes = team.heroes.slice(startIndex);
                let recovery = await getBestRecovery(teamNum, attackerType, team, 25);
                if (recovery > bestBattle.recovery) {
                    bestBattle.recovery = recovery;
                    bestBattle.selectedTeamNum = teamNum;
                    bestBattle.team = team;
                }
            }
            let workTime = new Date().getTime() - start.getTime();
            timeDungeon.attackEarthOrFire += workTime;
            if (bestBattle.recovery < -10) {
                return -1;
            }
            return bestBattle.selectedTeamNum;
		}

		/** Выбираем стихию для атаки */
		async function chooseElement(attackerType, teamNum) {
            let result;
            switch (attackerType) {
                case 'hero':
                case 'water':
                    result = await startBattle(teamNum, attackerType, teams[attackerType]);
                    break;
                case 'earth':
                case 'fire':
                    result = await attackEarthOrFire(teamNum, attackerType);
                    break;
                case 'neutral':
                    result = await attackNeutral(teamNum, attackerType);
            }
            if (!!result && attackerType != 'hero') {
                let recovery = (!!!bestBattle.recovery ? 10 * getRecovery(result) : bestBattle.recovery) * 100;
                let titans = result.progress[0].attackers.heroes;
                console.log("Проведен бой: " + attackerType +
                            ", recovery = " + (recovery > 0 ? "+" : "") + Math.round(recovery) + "% \r\n", titans);
            }
            endBattle(result);
        }

		/** Атакуем Землей или Огнем */
		async function attackEarthOrFire(teamNum, attackerType) {
            if (!!!bestBattle.recovery) {
                bestBattle.recovery = -11;
                let selectedTeamNum = -1;
                for (let attempt = 0; selectedTeamNum < 0 && attempt < 4; attempt++) {
                    selectedTeamNum = await attemptAttackEarthOrFire(teamNum, attackerType, attempt);
                }
                if (selectedTeamNum < 0) {
                    endDungeon('Невозможно победить без потери Титана!', attackerType);
                    return;
                }
            }
            return findAttack(teamNum, attackerType, bestBattle.team);
		}

		/** Находим подходящий результат для атаки */
		async function findAttack(teamNum, attackerType, team) {
            let start = new Date();
            let recovery = -1000;
            let iterations = 0;
            let result;
            let correction = 0.01;
            for (let needRecovery = bestBattle.recovery; recovery < needRecovery; needRecovery -= correction, iterations++) {
                result = await startBattle(teamNum, attackerType, team);
                recovery = getRecovery(result);
            }
            bestBattle.recovery = recovery;
            let workTime = new Date().getTime() - start.getTime();
            timeDungeon.findAttack += workTime;
            return result;
		}

		/** Атакуем Нейтральной командой */
		async function attackNeutral(teamNum, attackerType) {
            let start = new Date();
            let factors = calcFactor();
            bestBattle.recovery = -0.2;
            await findBestBattleNeutral(teamNum, attackerType, factors, true)
            if (bestBattle.recovery < 0 || (bestBattle.recovery < 0.2 && factors[0].value < 0.5)) {
                let recovery = 100 * bestBattle.recovery;
                console.log("Не удалось найти удачный бой в быстром режиме: " + attackerType +
                            ", recovery = " + (recovery > 0 ? "+" : "") + Math.round(recovery) + "% \r\n", bestBattle.attackers);
                await findBestBattleNeutral(teamNum, attackerType, factors, false)
            }
            let workTime = new Date().getTime() - start.getTime();
            timeDungeon.attackNeutral += workTime;
            if (!!bestBattle.attackers) {
                let team = getTeam(bestBattle.attackers);
                return findAttack(teamNum, attackerType, team);
            }
            endDungeon('Не удалось найти удачный бой!', attackerType);
            return undefined;
        }

        /** Находит лучшую нейтральную команду */
        async function findBestBattleNeutral(teamNum, attackerType, factors, mode) {
            let countFactors = factors.length < 4 ? factors.length : 4;
            let aradgi = !titansStates['4013']?.isDead;
            let edem = !titansStates['4023']?.isDead;
            let dark = [4032, 4033].filter(e => !titansStates[e]?.isDead);
            let light = [4042].filter(e => !titansStates[e]?.isDead);
            let actions = [];
            if (mode) {
                for (let i = 0; i < countFactors; i++) {
                    actions.push(startBattle(teamNum, attackerType, getNeutralTeam(factors[i].id)));
                }
                if (countFactors > 1) {
                    let firstId = factors[0].id;
                    let secondId = factors[1].id;
                    actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4001, secondId)));
                    actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4002, secondId)));
                    actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4003, secondId)));
                }
                if (aradgi) {
                    actions.push(startBattle(teamNum, attackerType, getNeutralTeam(4013)));
                    if (countFactors > 0) {
                        let firstId = factors[0].id;
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4000, 4013)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4001, 4013)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4002, 4013)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4003, 4013)));
                    }
                    if (edem) {
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(4023, 4000, 4013)));
                    }
                }
            } else {
                if (mode) {
                    for (let i = 0; i < factors.length; i++) {
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(factors[i].id)));
                    }
                } else {
                    countFactors = factors.length < 2 ? factors.length : 2;
                }
                for (let i = 0; i < countFactors; i++) {
                    let mainId = factors[i].id;
                    if (aradgi && (mode || i > 0)) {
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4000, 4013)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4001, 4013)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4002, 4013)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4003, 4013)));
                    }
                    for (let i = 0; i < dark.length; i++) {
                        let darkId = dark[i];
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4001, darkId)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4002, darkId)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4003, darkId)));
                    }
                    for (let i = 0; i < light.length; i++) {
                        let lightId = light[i];
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4001, lightId)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4002, lightId)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4003, lightId)));
                    }
                    let isFull = mode || i > 0;
                    for (let j = isFull ? i + 1 : 2; j < factors.length; j++) {
                        let extraId = factors[j].id;
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4000, extraId)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4001, extraId)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(mainId, 4002, extraId)));
                    }
                }
                if (aradgi) {
                    if (mode) {
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(4013)));
                    }
                    for (let i = 0; i < dark.length; i++) {
                        let darkId = dark[i];
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(darkId, 4001, 4013)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(darkId, 4002, 4013)));
                    }
                    for (let i = 0; i < light.length; i++) {
                        let lightId = light[i];
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(lightId, 4001, 4013)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(lightId, 4002, 4013)));
                    }
                }
                for (let i = 0; i < dark.length; i++) {
                    let firstId = dark[i];
                    actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId)));
                    for (let j = i + 1; j < dark.length; j++) {
                        let secondId = dark[j];
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4001, secondId)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4002, secondId)));
                    }
                }
                for (let i = 0; i < light.length; i++) {
                    let firstId = light[i];
                    actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId)));
                    for (let j = i + 1; j < light.length; j++) {
                        let secondId = light[j];
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4001, secondId)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4002, secondId)));
                    }
                }
            }
            for (let result of await Promise.all(actions)) {
                let recovery = getRecovery(result);
                if (recovery > bestBattle.recovery) {
                    bestBattle.recovery = recovery;
                    bestBattle.attackers = result.progress[0].attackers.heroes;
                }
            }
        }

        /** Получаем нейтральную команду */
        function getNeutralTeam(id, swapId, addId) {
            let neutralTeam = clone(teams.water);
            let neutral = neutralTeam.heroes;
            if (neutral.length == 4) {
                if (!!swapId) {
                    for (let i in neutral) {
                        if (neutral[i] == swapId) {
                            neutral[i] = addId;
                        }
                    }
                }
            } else if (!!addId) {
                neutral.push(addId);
            }
            neutral.push(id);
            return neutralTeam;
		}

		/** Получить команду титанов */
        function getTeam(titans) {
            return {
                favor: {},
                heroes: Object.keys(titans).map(id => parseInt(id)),
                teamNum: 0,
            };
        }

		/** Вычисляем фактор боеготовности титанов */
		function calcFactor() {
            let neutral = teams.neutral;
            let factors = [];
            for (let i in neutral) {
                let titanId = neutral[i];
                let titan = titansStates[titanId];
                let factor = !!titan ? titan.hp / titan.maxHp + titan.energy / 10000.0 : 1;
                if (factor > 0) {
                    factors.push({id: titanId, value: factor});
                }
            }
            factors.sort(function(a, b) {
                return a.value - b.value;
            });
            return factors;
		}

		/** Возвращает наилучший результат из нескольких боев */
		async function getBestRecovery(teamNum, attackerType, team, countBattle) {
            let bestRecovery = -1000;
            let actions = [];
            for (let i = 0; i < countBattle; i++) {
                actions.push(startBattle(teamNum, attackerType, team));
            }
            for (let result of await Promise.all(actions)) {
                let recovery = getRecovery(result);
                if (recovery > bestRecovery) {
                    bestRecovery = recovery;
                }
            }
            return bestRecovery;
        }

        /** Возвращает разницу в здоровье атакующей команды после и до битвы и проверяет здоровье титанов на необходимый минимум*/
        function getRecovery(result) {
            if (result.result.stars < 3) {
                return -100;
            }
            let beforeSumFactor = 0;
            let afterSumFactor = 0;
            let beforeTitans = result.battleData.attackers;
            let afterTitans = result.progress[0].attackers.heroes;
            for (let i in afterTitans) {
                let titan = afterTitans[i];
                let percentHP = titan.hp / beforeTitans[i].hp;
                let energy = titan.energy;
                let factor = checkTitan(i, energy, percentHP) ? getFactor(i, energy, percentHP) : -100;
                afterSumFactor += factor;
            }
            for (let i in beforeTitans) {
                let titan = beforeTitans[i];
                let state = titan.state;
                beforeSumFactor += !!state ? getFactor(i, state.energy, state.hp / titan.hp) : 1;
            }
            return afterSumFactor - beforeSumFactor;
        }

        /** Возвращает состояние титана*/
        function getFactor(id, energy, percentHP) {
            let elemantId = id.slice(2, 3);
            let isEarthOrFire = elemantId == '1' || elemantId == '2';
            let energyBonus = id == '4020' && energy == 1000 ? 0.1 : energy / 20000.0;
            let factor = percentHP + energyBonus;
            return isEarthOrFire ? factor : factor / 10;
        }

        /** Проверяет состояние титана*/
        function checkTitan(id, energy, percentHP) {
            switch (id) {
                case '4020':
                    return percentHP > 0.25 || (energy == 1000 && percentHP > 0.05);
                    break;
                case '4010':
                    return percentHP + energy / 2000.0 > 0.63;
                    break;
                case '4000':
                    return percentHP > 0.62 || (energy < 1000 && (
                        (percentHP > 0.45 && energy >= 400) ||
                        (percentHP > 0.3 && energy >= 670)));
            }
            return true;
        }


		/** Начинаем бой */
		function startBattle(teamNum, attackerType, args) {
			return new Promise(function (resolve, reject) {
				args.teamNum = teamNum;
				let startBattleCall = {
					calls: [{
						name: "dungeonStartBattle",
						args,
						ident: "body"
					}]
				}
				send(JSON.stringify(startBattleCall), resultBattle, {
					resolve,
					teamNum,
					attackerType
				});
			});
		}

		/** Возращает результат боя в промис */
		/*function resultBattle(resultBattles, args) {
            if (!!resultBattles && !!resultBattles.results) {
                let battleData = resultBattles.results[0].result.response;
                let battleType = "get_tower";
                if (battleData.type == "dungeon_titan") {
                    battleType = "get_titan";
                }
				battleData.progress = [{ attackers: { input: ["auto", 0, 0, "auto", 0, 0] } }];//тест подземка правки
                BattleCalc(battleData, battleType, function (result) {
                    result.teamNum = args.teamNum;
                    result.attackerType = args.attackerType;
                    args.resolve(result);
                });
            } else {
                endDungeon('Потеряна связь с сервером игры!', 'break');
            }
        }*/
        function resultBattle(resultBattles, args) {
		battleData = resultBattles.results[0].result.response;
		battleType = "get_tower";
		if (battleData.type == "dungeon_titan") {
			battleType = "get_titan";
		}
		battleData.progress = [{ attackers: { input: ["auto", 0, 0, "auto", 0, 0] } }];
		BattleCalc(battleData, battleType, function (result) {
			result.teamNum = args.teamNum;
			result.attackerType = args.attackerType;
			args.resolve(result);
		});
        }

		/** Заканчиваем бой */

        ////
        async function endBattle(battleInfo) {
		if (!!battleInfo) {
			const args = {
				result: battleInfo.result,
				progress: battleInfo.progress,
			}
            if (battleInfo.result.stars < 3) {
                    endDungeon('Герой или Титан мог погибнуть в бою!', battleInfo);
                    return;
                }
			if (countPredictionCard > 0) {
				args.isRaid = true;
			} else {
				const timer = getTimer(battleInfo.battleTime);
				console.log(timer);
				await countdownTimer(timer, `${I18N('DUNGEON2')}: ${I18N('TITANIT')} ${dungeonActivity}/${maxDungeonActivity}`);
			}
			const calls = [{
				name: "dungeonEndBattle",
				args,
				ident: "body"
			}];
			lastDungeonBattleData = null;
			send(JSON.stringify({ calls }), resultEndBattle);
		} else {
			endDungeon('dungeonEndBattle win: false\n', battleInfo);
		}
        }
		/** Получаем и обрабатываем результаты боя */
		function resultEndBattle(e) {
            if (!!e && !!e.results) {
                let battleResult = e.results[0].result.response;
                if ('error' in battleResult) {
                    endDungeon('errorBattleResult', battleResult);
                    return;
                }
                let dungeonGetInfo = battleResult.dungeon ?? battleResult;
                dungeonActivity += battleResult.reward.dungeonActivity ?? 0;
                checkFloor(dungeonGetInfo);
            } else {
                endDungeon('Потеряна связь с сервером игры!', 'break');
            }
        }

		/** Добавить команду титанов в общий список команд */
        function addTeam(team) {
            for (let i in countTeam) {
                if (equalsTeam(countTeam[i].team, team)) {
                    countTeam[i].count++;
                    return;
                }
            }
            countTeam.push({team: team, count: 1});
        }

		/** Сравнить команды на равенство */
        function equalsTeam(team1, team2) {
            if (team1.length == team2.length) {
                for (let i in team1) {
                    if (team1[i] != team2[i]) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }

		function saveProgress() {
			let saveProgressCall = {
				calls: [{
					name: "dungeonSaveProgress",
					args: {},
					ident: "body"
				}]
			}
			send(JSON.stringify(saveProgressCall), resultEndBattle);
		}


		/** Выводит статистику прохождения подземелья */
		function showStats() {
            let activity = dungeonActivity - startDungeonActivity;
            let workTime = clone(timeDungeon);
            workTime.all = new Date().getTime() - workTime.all;
            for (let i in workTime) {
                workTime[i] = (workTime[i] / 1000).round(0);
            }
            countTeam.sort(function(a, b) {
                return b.count - a.count;
            });
            console.log(titansStates);
            console.log("Собрано титанита: ", activity);
            console.log("Скорость сбора: " + (3600 * activity / workTime.all).round(0) + " титанита/час");
            console.log("Время раскопок: ");
            for (let i in workTime) {
                let timeNow = workTime[i];
                console.log(i + ": ", (timeNow / 3600).round(0) + " ч. " + (timeNow % 3600 / 60).round(0) + " мин. " + timeNow % 60 + " сек.");
            }
            console.log("Частота использования команд: ");
            for (let i in countTeam) {
                let teams = countTeam[i];
                console.log(teams.team + ": ", teams.count);
            }
		}

		/** Заканчиваем копать подземелье */
		function endDungeon(reason, info) {
            if (!end) {
                end = true;
                console.log(reason, info);
                showStats();
                if (info == 'break') {
                    setProgress('Dungeon stoped: Титанит ' + dungeonActivity + '/' + maxDungeonActivity +
                                "\r\nПотеряна связь с сервером игры!", false, hideProgress);
                } else {
                    setProgress('Dungeon completed: Титанит ' + dungeonActivity + '/' + maxDungeonActivity, false, hideProgress);
                }
                setTimeout(cheats.refreshGame, 1000);
                resolve();
            }
		}
	}

	//дарим подарки участникам других гильдий не выходя из своей гильдии
	function NewYearGift_Clan() {
	console.log('NewYearGift_Clan called...');
	const userID = getInput('userID');
	const AmontID = getInput('AmontID');
	const GiftNum = getInput('GiftNum');

	const data = {
		"calls": [{
				"name": "newYearGiftSend",
				"args": {
					"userId": userID,
					"amount": AmontID,
					"giftNum": GiftNum,
					"users": {
						[userID]: AmontID
					}
				},
				"ident": "body"
			}
		]
	}

	const dataJson = JSON.stringify(data);

	SendRequest(dataJson, e => {
			let userInfo = e.results[0].result.response;
			console.log(userInfo);
		});
		setProgress(I18N('SEND_GIFT'), true);
	}
})();

/**
 * TODO:
 * Добивание на арене титанов
 * Закрытие окошек по Esc
 * Починить работу скрипта на уровне команды ниже 10++
 * Написать номальную синхронизацию
 */