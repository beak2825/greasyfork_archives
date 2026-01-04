// ==UserScript==
// @name        HWD-fork
// @name:en        HWD-fork
// @name:ru        HWD-fork
// @namespace    HWD-fork
// @version        1.32
// @description        Automation of actions for the game Hero Wars
// @description:en    Automation of actions for the game Hero Wars
// @description:ru    Автоматизация действий для игры Хроники Хаоса
// @author        ZingerY, ApuoH, Gudwin, codetaku
// @license         Copyright ZingerY
// @icon            http://ilovemycomp.narod.ru/VaultBoyIco16.ico
// @icon64            http://ilovemycomp.narod.ru/VaultBoyIco64.png
// @match            https://www.hero-wars.com/*
// @match            https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/531877/HWD-fork.user.js
// @updateURL https://update.greasyfork.org/scripts/531877/HWD-fork.meta.js
// ==/UserScript==

// сделал ApuoH
(function() {
/**
 * Start script
 *
 * Стартуем скрипт
 */
console.log('%cStart ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: red');
/**
 * Script info
 *
 * Информация о скрипте
 */
this.scriptInfo = (({name, version, author, homepage, lastModified}, updateUrl) =>
    ({name, version, author, homepage, lastModified, updateUrl}))
    (GM_info.script, GM_info.scriptUpdateURL);
this.GM_info = GM_info;
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
/**
 * missionTimer
 *
 * missionTimer
 */
let missionBattle = null;
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
this.isTimeBetweenNewDays = function () {
    if (userInfo.timeZone <= 3) {
                return false;
            }
    const nextDayTs = new Date(userInfo.nextDayTs * 1e3);
    const nextServerDayTs = new Date(userInfo.nextServerDayTs * 1e3);
    if (nextDayTs > nextServerDayTs) {
        nextDayTs.setDate(nextDayTs.getDate() - 1);
    }
    const now = Date.now();
    if (now > nextDayTs && now < nextServerDayTs) {
        return true;
    }
    return false;
};
/**
 * Original methods for working with AJAX
 *
 * Оригинальные методы для работы с AJAX
 */
const original = {
    open: XMLHttpRequest.prototype.open,
    send: XMLHttpRequest.prototype.send,
    setRequestHeader: XMLHttpRequest.prototype.setRequestHeader,
    SendWebSocket: WebSocket.prototype.send,
    fetch: fetch,
};

// Sentry blocking
// Блокировка наблюдателя
this.fetch = function (url, options) {
    /**
     * Checking URL for blocking
     * Проверяем URL на блокировку
     */
    if (url.includes('sentry.io')) {
        console.log('%cFetch blocked', 'color: red');
        console.log(url, options);
        const body = {
            id: md5(Date.now()),
        };
        let info = {};
        try {
            info = JSON.parse(options.body);
        } catch (e) {}
        if (info.event_id) {
            body.id = info.event_id;
        }
        /**
         * Mock response for blocked URL
         *
         * Мокаем ответ для заблокированного URL
         */
        const mockResponse = new Response('Custom blocked response', {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body,
        });
        return Promise.resolve(mockResponse);
    } else {
        /**
         * Call the original fetch function for all other URLs
         * Вызываем оригинальную функцию fetch для всех других URL
         */
        return original.fetch.apply(this, arguments);
    }
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

this.xyz = (({ name, version, author }) => ({ name, version, author }))(GM_info.script);
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
        CANCEL_FIGHT_TITLE: 'Ability to cancel manual combat on GW, CoW and Asgard',
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
        SLOW_MODE: 'Slow Mode',
        SLOW_MODE_TITLE: 'If checked, enable computation of ALL possible neutral battles (up to 15504). Does not happen while using original calculations.',
        START_NEW_DUNG: 'Low Water Totem',
        NEW_DUNG_TITLE: 'Uses new calculations from the start that have a better result on low-level water totems',
        SLOW_ARR_LIMIT: 'The maximum number of battles to be stored and run at once in slow mode (affects RAM)',
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
        FURNACE_OF_SOULS: 'Furnace of souls',
        ARCHDEMON_TITLE: 'Hitting kills and collecting rewards',
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
        BOTTOM_URLS: '<a href="https://t.me/+0oMwICyV1aQ1MDAy" target="_blank" title="Telegram"><svg width="20" height="20" style="margin:2px" viewBox="0 0 1e3 1e3" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a" x1="50%" x2="50%" y2="99.258%"><stop stop-color="#2AABEE" offset="0"/><stop stop-color="#229ED9" offset="1"/></linearGradient></defs><g fill-rule="evenodd"><circle cx="500" cy="500" r="500" fill="url(#a)"/><path d="m226.33 494.72c145.76-63.505 242.96-105.37 291.59-125.6 138.86-57.755 167.71-67.787 186.51-68.119 4.1362-0.072862 13.384 0.95221 19.375 5.8132 5.0584 4.1045 6.4501 9.6491 7.1161 13.541 0.666 3.8915 1.4953 12.756 0.83608 19.683-7.5246 79.062-40.084 270.92-56.648 359.47-7.0089 37.469-20.81 50.032-34.17 51.262-29.036 2.6719-51.085-19.189-79.207-37.624-44.007-28.847-68.867-46.804-111.58-74.953-49.366-32.531-17.364-50.411 10.769-79.631 7.3626-7.6471 135.3-124.01 137.77-134.57 0.30968-1.3202 0.59708-6.2414-2.3265-8.8399s-7.2385-1.7099-10.352-1.0032c-4.4137 1.0017-74.715 47.468-210.9 139.4-19.955 13.702-38.029 20.379-54.223 20.029-17.853-0.3857-52.194-10.094-77.723-18.393-31.313-10.178-56.199-15.56-54.032-32.846 1.1287-9.0037 13.528-18.212 37.197-27.624z" fill="#fff"/></g></svg></a><a href="https://www.patreon.com/HeroWarsUserScripts" target="_blank" title="Patreon"><svg width="20" height="20" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF" stroke="None"><path d="m1033 324.45c-0.19-137.9-107.59-250.92-233.6-291.7-156.48-50.64-362.86-43.3-512.28 27.2-181.1 85.46-237.99 272.66-240.11 459.36-1.74 153.5 13.58 557.79 241.62 560.67 169.44 2.15 194.67-216.18 273.07-321.33 55.78-74.81 127.6-95.94 216.01-117.82 151.95-37.61 255.51-157.53 255.29-316.38z"/></g></svg></a>',
         GIFTS_SENT: 'Gifts sent!',
        DO_YOU_WANT: 'Do you really want to do this?',
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
        EXPEDITIONS_SENT: 'Expeditions:<br>Collected: {countGet}<br>Sent: {countSend}',
        EXPEDITIONS_NOTHING: 'Nothing to collect/send',
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
        DONT_HAVE_LIVES: "You don't have lives",
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
        NOT_ENOUGH_EMERALDS_540: 'Not enough emeralds, you need {imgEmerald}540 you have {imgEmerald}{currentStarMoney}',
        BUY_OUTLAND_BTN: 'Buy {count} chests {imgEmerald}{countEmerald}',
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
        RAID: 'Raid',
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
        REWARDS_AND_MAIL: 'Rewards and Mail',
        REWARDS_AND_MAIL_TITLE: 'Collects rewards and mail',
        New_Year_Clan: 'a gift for a friend',
        New_Year_Clan_TITLE: 'New Year gifts to friends',
        COLLECT_REWARDS_AND_MAIL: 'Collected {countQuests} rewards and {countMail} letters',
        TIMER_ALREADY: 'Timer already started {time}',
        NO_ATTEMPTS_TIMER_START: 'No attempts, timer started {time}',
        EPIC_BRAWL_RESULT: 'Wins: {wins}/{attempts}, Coins: {coins}, Streak: {progress}/{nextStage} [Close]{end}',
        ATTEMPT_ENDED: '<br>Attempts ended, timer started {time}',
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
        BOSS_HAS_BEEN_DEF: 'Boss {bossLvl} has been defeated.',
        NOT_ENOUGH_ATTEMPTS_BOSS: 'Not enough attempts to defeat boss {bossLvl}, retry?',
        BOSS_VICTORY_IMPOSSIBLE: 'Based on the recalculation of {battles} battles, victory has not been achieved. Would you like to continue the search for a winning battle in real battles?',
        BOSS_HAS_BEEN_DEF_TEXT: 'Boss {bossLvl} defeated in<br>{countBattle}/{countMaxBattle} attempts{winTimer}<br>(Please synchronize or restart the game to update the data)',
        MAP: 'Map: ',
        PLAYER_POS: 'Player positions:',
        NY_GIFTS: 'Gifts',
        NY_GIFTS_TITLE: "Open all New Year's gifts",
        NY_NO_GIFTS: 'No gifts not received',
        NY_GIFTS_COLLECTED: '{count} gifts collected',
        CHANGE_MAP: 'Island map',
        CHANGE_MAP_TITLE: 'Change island map',
        SELECT_ISLAND_MAP: 'Select an island map:',
        MAP_NUM: 'Map {num}',
        SECRET_WEALTH_SHOP: 'Secret Wealth {name}: ',
        SHOPS: 'Shops',
        SHOPS_DEFAULT: 'Default',
        SHOPS_DEFAULT_TITLE: 'Default stores',
        SHOPS_LIST: 'Shops {number}',
        SHOPS_LIST_TITLE: 'List of shops {number}',
        SHOPS_WARNING: 'Stores<br><span style="color:red">If you buy brawl store coins for emeralds, you must use them immediately, otherwise they will disappear after restarting the game!</span>',
        MINIONS_WARNING: 'The hero packs for attacking minions are incomplete, should I continue?',
        FAST_SEASON: 'Fast season',
        FAST_SEASON_TITLE: 'Skip the map selection screen in a season',
        SET_NUMBER_LEVELS: 'Specify the number of levels:',
        POSSIBLE_IMPROVE_LEVELS: 'It is possible to improve only {count} levels.<br>Improving?',
        NOT_ENOUGH_RESOURECES: 'Not enough resources',
        IMPROVED_LEVELS: 'Improved levels: {count}',
        ARTIFACTS_UPGRADE: 'Artifacts Upgrade',
        ARTIFACTS_UPGRADE_TITLE: 'Upgrades the specified amount of the cheapest hero artifacts',
        SKINS_UPGRADE: 'Skins Upgrade',
        SKINS_UPGRADE_TITLE: 'Upgrades the specified amount of the cheapest hero skins',
        HINT: '<br>Hint: ',
        PICTURE: '<br>Picture: ',
        ANSWER: '<br>Answer: ',
        NO_HEROES_PACK: 'Fight at least one battle to save the attacking team',
        BRAWL_AUTO_PACK: 'Automatic selection of packs',
        BRAWL_AUTO_PACK_NOT_CUR_HERO: 'Automatic pack selection is not suitable for the current hero',
        BRAWL_DAILY_TASK_COMPLETED: 'Daily task completed, continue attacking?',
        CALC_STAT: 'Calculate statistics',
        ELEMENT_TOURNAMENT_REWARD: 'Unclaimed bonus for Elemental Tournament',
        BTN_TRY_FIX_IT: 'Fix it',
        BTN_TRY_FIX_IT_TITLE: 'Enable auto attack combat correction',
        DAMAGE_FIXED: 'Damage fixed from {lastDamage} to {maxDamage}!',
        DAMAGE_NO_FIXED: 'Failed to fix damage: {lastDamage}',
        LETS_FIX: "Let's fix",
        COUNT_FIXED: 'For {count} attempts',
        DEFEAT_TURN_TIMER: 'Defeat! Turn on the timer to complete the mission?',
        SEASON_REWARD: 'Season Rewards',
        SEASON_REWARD_TITLE: 'Collects available free rewards from all current seasons',
        SEASON_REWARD_COLLECTED: 'Collected {count} season rewards',
        SELL_HERO_SOULS: 'Sell ​​souls',
        SELL_HERO_SOULS_TITLE: 'Exchanges all absolute star hero souls for gold',
        GOLD_RECEIVED: 'Gold received: {gold}',
        OPEN_ALL_EQUIP_BOXES: 'Open all Equipment Fragment Box?',
        SERVER_NOT_ACCEPT: 'The server did not accept the result',
        INVASION_BOSS_BUFF: 'For {bossLvl} boss need buff {needBuff} you have {haveBuff}}',
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
        CANCEL_FIGHT_TITLE: 'Возможность отмены ручного боя на ВГ, СМ и в Асгарде',
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
        SLOW_MODE: 'Медленный режим',
        SLOW_MODE_TITLE: 'Если true, включить расчет ВСЕХ возможных нейтральных сражений (до 15504) при необходимости',
        START_NEW_DUNG: 'Тотем низкого уровня воды',
        NEW_DUNG_TITLE: 'Использует новые расчеты с самого начала, которые дают лучший результат на тотеме низкого уровня воды',
        SLOW_ARR_LIMIT: 'Максимальное количество сражений, которые можно сохранить и запустить одновременно в медленном режиме (влияет на оперативную память)',
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
        SYNC_TITLE: 'Частичная синхронизация данных игры без перезагрузки сатраницы',
        ARCHDEMON: 'Архидемон',
        FURNACE_OF_SOULS: 'Горнило душ',
        ARCHDEMON_TITLE: 'Набивает килы и собирает награду',
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
        BOTTOM_URLS: '<a href="https://t.me/+q6gAGCRpwyFkNTYy" target="_blank" title="Telegram"><svg width="20" height="20" style="margin:2px" viewBox="0 0 1e3 1e3" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a" x1="50%" x2="50%" y2="99.258%"><stop stop-color="#2AABEE" offset="0"/><stop stop-color="#229ED9" offset="1"/></linearGradient></defs><g fill-rule="evenodd"><circle cx="500" cy="500" r="500" fill="url(#a)"/><path d="m226.33 494.72c145.76-63.505 242.96-105.37 291.59-125.6 138.86-57.755 167.71-67.787 186.51-68.119 4.1362-0.072862 13.384 0.95221 19.375 5.8132 5.0584 4.1045 6.4501 9.6491 7.1161 13.541 0.666 3.8915 1.4953 12.756 0.83608 19.683-7.5246 79.062-40.084 270.92-56.648 359.47-7.0089 37.469-20.81 50.032-34.17 51.262-29.036 2.6719-51.085-19.189-79.207-37.624-44.007-28.847-68.867-46.804-111.58-74.953-49.366-32.531-17.364-50.411 10.769-79.631 7.3626-7.6471 135.3-124.01 137.77-134.57 0.30968-1.3202 0.59708-6.2414-2.3265-8.8399s-7.2385-1.7099-10.352-1.0032c-4.4137 1.0017-74.715 47.468-210.9 139.4-19.955 13.702-38.029 20.379-54.223 20.029-17.853-0.3857-52.194-10.094-77.723-18.393-31.313-10.178-56.199-15.56-54.032-32.846 1.1287-9.0037 13.528-18.212 37.197-27.624z" fill="#fff"/></g></svg></a><a href="https://vk.com/invite/YNPxKGX" target="_blank" title="Вконтакте"><svg width="20" height="20" style="margin:2px" viewBox="0 0 101 100" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)"><path d="M0.5 48C0.5 25.3726 0.5 14.0589 7.52944 7.02944C14.5589 0 25.8726 0 48.5 0H52.5C75.1274 0 86.4411 0 93.4706 7.02944C100.5 14.0589 100.5 25.3726 100.5 48V52C100.5 74.6274 100.5 85.9411 93.4706 92.9706C86.4411 100 75.1274 100 52.5 100H48.5C25.8726 100 14.5589 100 7.52944 92.9706C0.5 85.9411 0.5 74.6274 0.5 52V48Z" fill="#07f"/><path d="m53.708 72.042c-22.792 0-35.792-15.625-36.333-41.625h11.417c0.375 19.083 8.7915 27.167 15.458 28.833v-28.833h10.75v16.458c6.5833-0.7083 13.499-8.2082 15.832-16.458h10.75c-1.7917 10.167-9.2917 17.667-14.625 20.75 5.3333 2.5 13.875 9.0417 17.125 20.875h-11.834c-2.5417-7.9167-8.8745-14.042-17.25-14.875v14.875h-1.2919z" fill="#fff"/></g><defs><clipPath id="a"><rect transform="translate(.5)" width="100" height="100" fill="#fff"/></clipPath></defs></svg></a>',
         GIFTS_SENT: 'Подарки отправлены!',
        DO_YOU_WANT: 'Вы действительно хотите это сделать?',
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
        EXPEDITIONS_SENT: 'Экспедиции:<br>Собрано: {countGet}<br>Отправлено: {countSend}',
        EXPEDITIONS_NOTHING: 'Нечего собирать/отправлять',
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
        QUEST_10043: 'Начни или присоеденись к Приключению',
        QUEST_10044: 'Воспользуйся призывом питомцев 1 раз',
        QUEST_10046: 'Открой 3 сундука в Приключениях',
        QUEST_10047: 'Набери 150 очков активности в Гильдии',
        NOTHING_TO_DO: 'Нечего выполнять',
        YOU_CAN_COMPLETE: 'Можно выполнить квесты',
        BTN_DO_IT: 'Выполняй',
        NOT_QUEST_COMPLETED: 'Ни одного квеста не выполенно',
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
        OPEN_LOOTBOX: 'У Вас {lootBox} ящиков, откываем?',
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
        NOT_ENOUGH_EMERALDS_540: 'Недостаточно изюма, нужно {imgEmerald}540 у Вас {imgEmerald}{currentStarMoney}',
        BUY_OUTLAND_BTN: 'Купить {count} сундуков {imgEmerald}{countEmerald}',
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
        RAID: 'Рейд',
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
        TIMER_ALREADY: 'Таймер уже запущен {time}',
        NO_ATTEMPTS_TIMER_START: 'Попыток нет, запущен таймер {time}',
        EPIC_BRAWL_RESULT: '{i} Победы: {wins}/{attempts}, Монеты: {coins}, Серия: {progress}/{nextStage} [Закрыть]{end}',
        ATTEMPT_ENDED: '<br>Попытки закончились, запущен таймер {time}',
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
        BOSS_HAS_BEEN_DEF: 'Босс {bossLvl} побежден',
        NOT_ENOUGH_ATTEMPTS_BOSS: 'Для победы босса ${bossLvl} не хватило попыток, повторить?',
        BOSS_VICTORY_IMPOSSIBLE: 'По результатам прерасчета {battles} боев победу получить не удалось. Вы хотите продолжить поиск победного боя на реальных боях?',
        BOSS_HAS_BEEN_DEF_TEXT: 'Босс {bossLvl} побежден за<br>{countBattle}/{countMaxBattle} попыток{winTimer}<br>(Сделайте синхронизацию или перезагрузите игру для обновления данных)',
        MAP: 'Карта: ',
        PLAYER_POS: 'Позиции игроков:',
        NY_GIFTS: 'Подарки',
        NY_GIFTS_TITLE: 'Открыть все новогодние подарки',
        NY_NO_GIFTS: 'Нет не полученных подарков',
        NY_GIFTS_COLLECTED: 'Собрано {count} подарков',
        CHANGE_MAP: 'Карта острова',
        CHANGE_MAP_TITLE: 'Сменить карту острова',
        SELECT_ISLAND_MAP: 'Выберите карту острова:',
        MAP_NUM: 'Карта {num}',
        SECRET_WEALTH_SHOP: 'Тайное богатство {name}: ',
        SHOPS: 'Магазины',
        SHOPS_DEFAULT: 'Стандартные',
        SHOPS_DEFAULT_TITLE: 'Стандартные магазины',
        SHOPS_LIST: 'Магазины {number}',
        SHOPS_LIST_TITLE: 'Список магазинов {number}',
        SHOPS_WARNING: 'Магазины<br><span style="color:red">Если Вы купите монеты магазинов потасовок за изумруды, то их надо использовать сразу, иначе после перезагрузки игры они пропадут!</span>',
        MINIONS_WARNING: 'Пачки героев для атаки приспешников неполные, продолжить?',
        FAST_SEASON: 'Быстрый сезон',
        FAST_SEASON_TITLE: 'Пропуск экрана с выбором карты в сезоне',
        SET_NUMBER_LEVELS: 'Указать колличество уровней:',
        POSSIBLE_IMPROVE_LEVELS: 'Возможно улучшить только {count} уровней.<br>Улучшаем?',
        NOT_ENOUGH_RESOURECES: 'Не хватает ресурсов',
        IMPROVED_LEVELS: 'Улучшено уровней: {count}',
        ARTIFACTS_UPGRADE: 'Улучшение артефактов',
        ARTIFACTS_UPGRADE_TITLE: 'Улучшает указанное количество самых дешевых артефактов героев',
        SKINS_UPGRADE: 'Улучшение обликов',
        SKINS_UPGRADE_TITLE: 'Улучшает указанное количество самых дешевых обликов героев',
        HINT: '<br>Подсказка: ',
        PICTURE: '<br>На картинке: ',
        ANSWER: '<br>Ответ: ',
        NO_HEROES_PACK: 'Проведите хотя бы один бой для сохранения атакующей команды',
        BRAWL_AUTO_PACK: 'Автоподбор пачки',
        BRAWL_AUTO_PACK_NOT_CUR_HERO: 'Автоматический подбор пачки не подходит для текущего героя',
        BRAWL_DAILY_TASK_COMPLETED: 'Ежедневное задание выполнено, продолжить атаку?',
        CALC_STAT: 'Посчитать статистику',
        ELEMENT_TOURNAMENT_REWARD: 'Несобранная награда за Турнир Стихий',
        BTN_TRY_FIX_IT: 'Исправить',
        BTN_TRY_FIX_IT_TITLE: 'Включить исправление боев при автоатаке',
        DAMAGE_FIXED: 'Урон исправлен с {lastDamage} до {maxDamage}!',
        DAMAGE_NO_FIXED: 'Не удалось исправить урон: {lastDamage}',
        LETS_FIX: 'Исправляем',
        COUNT_FIXED: 'За {count} попыток',
        DEFEAT_TURN_TIMER: 'Поражение! Включить таймер для завершения миссии?',
        SEASON_REWARD: 'Награды сезонов',
        SEASON_REWARD_TITLE: 'Собирает доступные бесплатные награды со всех текущих сезонов',
        SEASON_REWARD_COLLECTED: 'Собрано {count} наград сезонов',
        SELL_HERO_SOULS: 'Продать души',
        SELL_HERO_SOULS_TITLE: 'Обменивает все души героев с абсолютной звездой на золото',
        GOLD_RECEIVED: 'Получено золота: {gold}',
        OPEN_ALL_EQUIP_BOXES: 'Открыть все ящики фрагментов экипировки?',
        SERVER_NOT_ACCEPT: 'Сервер не принял результат',
        INVASION_BOSS_BUFF: 'Для {bossLvl} босса нужен баф {needBuff} у вас {haveBuff}',
    },
};

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
    showErrors: {
        label: I18N('SHOW_ERRORS'),
        cbox: null,
        title: I18N('SHOW_ERRORS_TITLE'),
        default: true,
    },
    slowMode: {
        label: I18N('SLOW_MODE'),
        cbox: null,
        title: I18N('SLOW_MODE_TITLE'),
        default: false,
    },
    startNewDungeon: {
        label: I18N('START_NEW_DUNG'),
        cbox: null,
        title: I18N('NEW_DUNG_TITLE'),
        default: false,
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
        default: 20000,
    },

    slowModeLimit: {
        input: null,
        title: I18N('SLOW_ARR_LIMIT'),
        default: 50,
    },

    FPS: {
        input: null,
        title: 'FPS',
        default: 60,
    }
}

/**
 * Checks the checkbox
 *
 * Поплучить данные поля ввода
 */
/*function getInput(inputName) {
    return inputs[inputName]?.input?.value;
}*/
function getInput(inputName) {
if (inputName in inputs){return inputs[inputName]?.input?.value;}
    //else if (inputName in inputs3){return inputs3[inputName]?.input?.value;}
    else return null;
}

//тест рейд
/** Автоповтор миссии */
let isRepeatMission = false;
/** Вкл/Выкл автоповтор миссии */
this.switchRepeatMission = function() {
    isRepeatMission = !isRepeatMission;
    console.log(isRepeatMission);
}

/**
 * Control FPS
 *
 * Контроль FPS
 */
let nextAnimationFrame = Date.now();
const oldRequestAnimationFrame = this.requestAnimationFrame;
this.requestAnimationFrame = async function (e) {
    const FPS = Number(getInput('FPS')) || -1;
    const now = Date.now();
    const delay = nextAnimationFrame - now;
    nextAnimationFrame = Math.max(now, nextAnimationFrame) + Math.min(1e3 / FPS, 1e3);
    if (delay > 0) {
        await new Promise((e) => setTimeout(e, delay));
    }
    oldRequestAnimationFrame(e);
};

/**
 * Button List
 *
 * Список кнопочек
 */
const buttons = {
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

    newDay: {
        name: I18N('SYNC'),
        title: I18N('SYNC_TITLE'),
        func: function () {
            confShow(`${I18N('RUN_SCRIPT')} ${I18N('SYNC')}?`, cheats.refreshGame);
        },
    },
};
/**
 * Display buttons
 *
 * Вывести кнопочки
 */
function addControlButtons() {
    for (let name in buttons) {
        let button = buttons[name];
        if (button.hide) {
            continue;
        }
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
 * Start time of the last battle in the company
 *
 * Время начала последнего боя в кампании
 */
let lastMissionBattleStart = 0;
/**
 * Data for calculating the last battle with the boss
 *
 * Данные для расчете последнего боя с боссом
 */
let lastBossBattle = null;
/**
 * Information about the last battle
 *
 * Данные о прошедшей битве
 */
let lastBattleArg = {}
let lastBossBattleStart = null;
this.addBattleTimer = 4;
this.invasionTimer = 2500;
const invasionInfo = {
    buff: 0,
    bossLvl: 130,
};
const invasionDataPacks = {
    130: { buff: 0, pet: 6004, heroes: [58, 48, 16, 65, 59], favor: { 16: 6004, 48: 6001, 58: 6002, 59: 6005, 65: 6000 } },
    140: { buff: 0, pet: 6006, heroes: [1, 4, 13, 58, 65], favor: { 1: 6001, 4: 6006, 13: 6002, 58: 6005, 65: 6000 } },
    150: { buff: 0, pet: 6006, heroes: [1, 12, 17, 21, 65], favor: { 1: 6001, 12: 6003, 17: 6006, 21: 6002, 65: 6000 } },
    160: { buff: 0, pet: 6008, heroes: [12, 21, 34, 58, 65], favor: { 12: 6003, 21: 6006, 34: 6008, 58: 6002, 65: 6001 } },
    170: { buff: 0, pet: 6005, heroes: [33, 12, 65, 21, 4], favor: { 4: 6001, 12: 6003, 21: 6006, 33: 6008, 65: 6000 } },
    180: { buff: 20, pet: 6009, heroes: [58, 13, 5, 17, 65], favor: { 5: 6006, 13: 6003, 58: 6005 } },
    190: { buff: 0, pet: 6006, heroes: [1, 12, 21, 36, 65], favor: { 1: 6004, 12: 6003, 21: 6006, 36: 6005, 65: 6000 } },
    200: { buff: 0, pet: 6006, heroes: [12, 1, 13, 2, 65], favor: { 2: 6001, 12: 6003, 13: 6006, 65: 6000 } },
    210: { buff: 15, pet: 6005, heroes: [12, 21, 33, 58, 65], favor: { 12: 6003, 21: 6006, 33: 6008, 58: 6005, 65: 6001 } },
    220: { buff: 5, pet: 6006, heroes: [58, 13, 7, 34, 65], favor: { 7: 6002, 13: 6008, 34: 6006, 58: 6005, 65: 6001 } },
    230: { buff: 35, pet: 6005, heroes: [5, 7, 13, 58, 65], favor: { 5: 6006, 7: 6003, 13: 6002, 58: 6005, 65: 6000 } },
    240: { buff: 0, pet: 6005, heroes: [12, 58, 1, 36, 65], favor: { 1: 6006, 12: 6003, 36: 6005, 65: 6001 } },
    250: { buff: 15, pet: 6005, heroes: [12, 36, 4, 16, 65], favor: { 12: 6003, 16: 6004, 36: 6005, 65: 6001 } },
    260: { buff: 15, pet: 6005, heroes: [48, 12, 36, 65, 4], favor: { 4: 6006, 12: 6003, 36: 6005, 48: 6000, 65: 6007 } },
    270: { buff: 35, pet: 6005, heroes: [12, 58, 36, 4, 65], favor: { 4: 6006, 12: 6003, 36: 6005 } },
    280: { buff: 80, pet: 6005, heroes: [21, 36, 48, 7, 65], favor: { 7: 6003, 21: 6006, 36: 6005, 48: 6001, 65: 6000 } },
    290: { buff: 95, pet: 6008, heroes: [12, 21, 36, 35, 65], favor: { 12: 6003, 21: 6006, 36: 6005, 65: 6007 } },
    300: { buff: 25, pet: 6005, heroes: [12, 13, 4, 34, 65], favor: { 4: 6006, 12: 6003, 13: 6007, 34: 6002 } },
    310: { buff: 45, pet: 6005, heroes: [12, 21, 58, 33, 65], favor: { 12: 6003, 21: 6006, 33: 6002, 58: 6005, 65: 6007 } },
    320: { buff: 70, pet: 6005, heroes: [12, 48, 2, 6, 65], favor: { 6: 6005, 12: 6003 } },
    330: { buff: 70, pet: 6005, heroes: [12, 21, 36, 5, 65], favor: { 5: 6002, 12: 6003, 21: 6006, 36: 6005, 65: 6000 } },
    340: { buff: 55, pet: 6009, heroes: [12, 36, 13, 6, 65], favor: { 6: 6005, 12: 6003, 13: 6002, 36: 6006, 65: 6000 } },
    350: { buff: 100, pet: 6005, heroes: [12, 21, 58, 34, 65], favor: { 12: 6003, 21: 6006, 58: 6005 } },
    360: { buff: 85, pet: 6007, heroes: [12, 21, 36, 4, 65], favor: { 4: 6006, 12: 6003, 21: 6002, 36: 6005 } },
    370: { buff: 90, pet: 6008, heroes: [12, 21, 36, 13, 65], favor: { 12: 6003, 13: 6007, 21: 6006, 36: 6005, 65: 6001 } },
    380: { buff: 165, pet: 6005, heroes: [12, 33, 36, 4, 65], favor: { 4: 6001, 12: 6003, 33: 6006 } },
    390: { buff: 235, pet: 6005, heroes: [21, 58, 48, 2, 65], favor: { 2: 6005, 21: 6002 } },
    400: { buff: 125, pet: 6006, heroes: [12, 21, 36, 48, 65], favor: { 12: 6003, 21: 6006, 36: 6005, 48: 6001, 65: 6007 } },
};
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
let correctShowOpenArtifact = 0;
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
let clanDominationGetInfo = null;
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
const randf = function (min, max) {
    return Math.random() * (max - min + 1) + min;
};
/**
 * Clearing the request history
 *
 * Очистка истоии запросов
 */
setInterval(function () {
    let now = Date.now();
    for (let i in requestHistory) {
        const time = +i.split('_')[0];
        if (now - time > 300000) {
            delete requestHistory[i];
        }
    }
}, 300000);
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
 * Override/proxy the method for creating a WS package send
 *
 * Переопределяем/проксируем метод создания отправки WS пакета
 */
WebSocket.prototype.send = function (data) {
    if (!this.isSetOnMessage) {
        const oldOnmessage = this.onmessage;
        this.onmessage = function (event) {
            try {
                const data = JSON.parse(event.data);
                if (!this.isWebSocketLogin && data.result.type == "iframeEvent.login") {
                    this.isWebSocketLogin = true;
                } else if (data.result.type == "iframeEvent.login") {
                    return;
                }
            } catch (e) { }
            return oldOnmessage.apply(this, arguments);
        }
        this.isSetOnMessage = true;
    }
    original.SendWebSocket.call(this, data);
}
/**
 * Overriding/Proxying the Ajax Request Creation Method
 *
 * Переопределяем/проксируем метод создания Ajax запроса
 */
XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this.uniqid = Date.now() + '_' + random(1000000, 10000000);
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
        if (name == 'X-Auth-Signature') {
            requestHistory[this.uniqid].signature.push(value);
            if (!check) {
                return;
            }
        }
    } else {
        check = true;
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

            if (cheats.libGame) {
                lib.setData(cheats.libGame);
            } else {
                lib.setData(await cheats.LibLoad());
            }

            addControls();
            addControlButtons();
            addBottomUrls();

            cheats.activateHacks();

            justInfo();
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
            if (this.errorRequest) {
                return oldReady.apply(this, arguments);
            }
            if(this.readyState == 4 && this.status == 200) {
                let isTextResponse = this.responseType === "text" || this.responseType === "";
                let response = isTextResponse ? this.responseText : this.response;
                requestHistory[this.uniqid].response = response;
                /**
                 * Replacing incoming request data
                 *
                 * Заменна данных входящего запроса
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
                /** Удаляем из истории запросов битвы с боссом */
                if ('invasion_bossStart' in requestHistory[this.uniqid].calls) delete requestHistory[this.uniqid];
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
            if (typeof this.onReadySuccess == 'function') {
                setTimeout(this.onReadySuccess, 200);
            }
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
                let hero = heroes[ids];
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
        let testData = JSON.parse(tempData);
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
                call.name == 'titanArenaEndBattle' ||
                call.name == 'bossEndBattle' ||
                call.name == 'clanRaid_endNodeBattle') &&
                isCancalBattle) {
                nameFuncEndBattle = call.name;

                if (isChecked('tryFixIt_v2') &&
                    !call.args.result.win &&
                    (call.name == 'brawl_endBattle' ||
                    //call.name == 'crossClanWar_endBattle' ||
                    call.name == 'epicBrawl_endBattle' ||
                    //call.name == 'clanWarEndBattle' ||
                    call.name == 'adventure_endBattle' ||
                    call.name == 'titanArenaEndBattle' ||
                    call.name == 'bossEndBattle' ||
                    call.name == 'adventureSolo_endBattle') &&
                    lastBattleInfo) {
                    const noFixWin = call.name == 'clanWarEndBattle' || call.name == 'crossClanWar_endBattle';
                    const cloneBattle = structuredClone(lastBattleInfo);
                    lastBattleInfo = null;
                    try {
                        const bFix = new BestOrWinFixBattle(cloneBattle);
                        bFix.setNoMakeWin(noFixWin);
                        let endTime = Date.now() + 3e4;
                        if (endTime < cloneBattle.endTime) {
                            endTime = cloneBattle.endTime;
                        }
                        const result = await bFix.start(cloneBattle.endTime, 150);

                        if (result.result.win) {
                            call.args.result = result.result;
                            call.args.progress = result.progress;
                            changeRequest = true;
                        } else if (result.value) {
                            if (
                                await popup.confirm('Поражение<br>Лучший результат: ' + result.value + '%', [
                                    { msg: 'Отмена', result: 0 },
                                    { msg: 'Принять', result: 1 },
                                ])
                            ) {
                                call.args.result = result.result;
                                call.args.progress = result.progress;
                                changeRequest = true;
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }

                if (!call.args.result.win) {
                    let resultPopup = false;
                    if (call.name == 'adventure_endBattle' ||
                        //call.name == 'invasion_bossEnd' ||
                        call.name == 'bossEndBattle' ||
                        call.name == 'adventureSolo_endBattle') {
                        resultPopup = await showMsgs(I18N('MSG_HAVE_BEEN_DEFEATED'), I18N('BTN_OK'), I18N('BTN_CANCEL'), I18N('BTN_AUTO'));
                    } else if (call.name == 'clanWarEndBattle' ||
                            call.name == 'crossClanWar_endBattle') {
                        resultPopup = await showMsg(I18N('MSG_HAVE_BEEN_DEFEATED'), I18N('BTN_OK'), I18N('BTN_AUTO_F5'));
                    } else if (call.name !== 'epicBrawl_endBattle' && call.name !== 'titanArenaEndBattle') {
                        resultPopup = await showMsg(I18N('MSG_HAVE_BEEN_DEFEATED'), I18N('BTN_OK'), I18N('BTN_CANCEL'));
                    }
                    if (resultPopup) {
                        if (call.name == 'invasion_bossEnd') {
                            this.errorRequest = true;
                        }
                        fixBattle(call.args.progress[0].attackers.heroes);
                        fixBattle(call.args.progress[0].defenders.heroes);
                        changeRequest = true;
                        if (resultPopup > 1) {
                            this.onReadySuccess = testAutoBattle;
                            // setTimeout(bossBattle, 1000);
                        }
                    }
                } else if (call.args.result.stars < 3 && call.name == 'towerEndBattle') {
                    let resultPopup = await showMsg(I18N('LOST_HEROES'), I18N('BTN_OK'), I18N('BTN_CANCEL'), I18N('BTN_AUTO'));
                    if (resultPopup) {
                        fixBattle(call.args.progress[0].attackers.heroes);
                        fixBattle(call.args.progress[0].defenders.heroes);
                        changeRequest = true;
                        if (resultPopup > 1) {
                            this.onReadySuccess = testAutoBattle;
                        }
                    }
                }
            }
            /**
             * Save the Asgard Boss Attack Pack
             * Сохраняем пачку для атаки босса Асгарда
             */
            if (call.name == 'clanRaid_startBossBattle') {
                console.log(JSON.stringify(call.args));
            }
            /**
             * Saving the request to start the last battle
             * Сохранение запроса начала последнего боя
             */
            if (
                call.name == 'clanWarAttack' ||
                call.name == 'crossClanWar_startBattle' ||
                call.name == 'adventure_turnStartBattle' ||
                call.name == 'adventureSolo_turnStartBattle' ||
                call.name == 'bossAttack' ||
                call.name == 'invasion_bossStart' ||
                call.name == 'towerStartBattle'
            ) {
                nameFuncStartBattle = call.name;
                lastBattleArg = call.args;

                if (call.name == 'invasion_bossStart') {
                    const timePassed = Date.now() - lastBossBattleStart;
                    if (timePassed < invasionTimer) {
                        await new Promise((e) => setTimeout(e, invasionTimer - timePassed));
                    }
                    invasionTimer -= 1;
                }
                lastBossBattleStart = Date.now();
            }
            if (call.name == 'invasion_bossEnd') {
                const lastBattle = lastBattleInfo;
                if (lastBattle && call.args.result.win) {
                    lastBattle.progress = call.args.progress;
                    const result = await Calc(lastBattle);
                    let timer = getTimer(result.battleTime, 1) + addBattleTimer;
                    const period = Math.ceil((Date.now() - lastBossBattleStart) / 1000);
                    console.log(timer, period);
                    if (period < timer) {
                        timer = timer - period;
                        await countdownTimer(timer);
                    }
                }
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

                    let timer = result.battleTimer + addBattleTimer;
                    const period = Math.ceil((Date.now() - lastDungeonBattleStart) / 1000);
                    console.log(timer, period);
                    if (period < timer) {
                        timer = timer - period;
                        await countdownTimer(timer);
                    }
                }
            }
            /**
             * Present
             * Подарки
             */
            if (call.name == 'freebieCheck') {
                freebieCheckInfo = call;
            }
            /** missionTimer */
            if (call.name == 'missionEnd' && missionBattle) {
                let startTimer = false;
                if (!call.args.result.win) {
                    startTimer = await popup.confirm(I18N('DEFEAT_TURN_TIMER'), [
                        { msg: I18N('BTN_NO'), result: false },
                        { msg: I18N('BTN_YES'), result: true },
                    ]);
                }

                if (call.args.result.win || startTimer) {
                    missionBattle.progress = call.args.progress;
                    missionBattle.result = call.args.result;
                    const result = await Calc(missionBattle);

                    let timer = result.battleTimer + addBattleTimer;
                    const period = Math.ceil((Date.now() - lastMissionBattleStart) / 1000);
                    if (period < timer) {
                        timer = timer - period;
                        await countdownTimer(timer);
                    }
                    missionBattle = null;
                } else {
                    this.errorRequest = true;
                }
            }
            /**
             * Getting mission data
             * Получение данных миссии
             * missionTimer
             */
            if (call.name == 'missionStart') {
                lastMissionStart = call.args;
                lastMissionBattleStart = Date.now();
            }
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
    let isChange = false;
    let respond = "";
    try {
        let nowTime = Math.round(Date.now() / 1000);
        let callsIdent = requestHistory[this.uniqid].calls;
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
            if (respond.error.name != 'AccountBan') {
                delete respond.error;
                respond.results = [];
            }
        }
        let mainReward = null;
        const allReward = {};
        let countTypeReward = 0;
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
                let userId = call.result.response.userId;
                if (localStorage['userId'] != userId) {
                    localStorage['newGiftSendIds'] = '';
                    localStorage['userId'] = userId;
                }
                await openOrMigrateDatabase(userId);
                readQuestInfo = true;
            }
            /**
             * Hiding donation offers 1
             * Скрываем предложения доната 1
             */
            if (call.ident == callsIdent['billingGetAll'] && getSaveVal('noOfferDonat')) {
                const billings = call.result.response?.billings;
                const bundle = call.result.response?.bundle;
                if (billings && bundle) {
                    call.result.response.billings = call.result.response.billings.filter((e) => ['repeatableOffer'].includes(e.type));
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
                    call.result.response = offers.filter(
                        (e) => !['addBilling', 'bundleCarousel'].includes(e.type) || ['idleResource', 'stagesOffer'].includes(e.offerType)
                    );
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
             * Hiding donation offers 4
             * Скрываем предложения доната 4
             */
            if (call.result?.specialOffers) {
                const offers = call.result.specialOffers;
                call.result.specialOffers = offers.filter(
                    (e) => !['addBilling', 'bundleCarousel'].includes(e.type) || ['idleResource', 'stagesOffer'].includes(e.offerType)
                );
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
                document.title = user.name;
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
            if (call.ident == callsIdent['clanWarAttack'] ||
                call.ident == callsIdent['crossClanWar_startBattle'] ||
                call.ident == callsIdent['bossAttack'] ||
                call.ident == callsIdent['battleGetReplay'] ||
                call.ident == callsIdent['brawl_startBattle'] ||
                call.ident == callsIdent['adventureSolo_turnStartBattle'] ||
                call.ident == callsIdent['invasion_bossStart'] ||
                call.ident == callsIdent['titanArenaStartBattle'] ||
                call.ident == callsIdent['towerStartBattle'] ||
                call.ident == callsIdent['adventure_turnStartBattle']) {
                let battle = call.result.response.battle || call.result.response.replay;
                if (call.ident == callsIdent['brawl_startBattle'] ||
                    call.ident == callsIdent['bossAttack'] ||
                    call.ident == callsIdent['towerStartBattle'] ||
                    call.ident == callsIdent['invasion_bossStart']) {
                    battle = call.result.response;
                }
                lastBattleInfo = battle;
                if (call.ident == callsIdent['battleGetReplay'] && call.result.response.replay.type ===    "clan_raid") {
                    if (call?.result?.response?.replay?.result?.damage) {
                        const damages = Object.values(call.result.response.replay.result.damage);
                        const bossDamage = damages.reduce((a, v) => a + v, 0);
                        setProgress(I18N('BOSS_DAMAGE') + bossDamage.toLocaleString(), false, hideProgress);
                        continue;
                    }
                }
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
                let countTestBattle = getInput('countTestBattle');
                if (call.ident == callsIdent['invasion_bossStart'] ) {
                    countTestBattle = 0;
                }
                if (call.ident == callsIdent['battleGetReplay']) {
                    battle.progress = [{ attackers: { input: ['auto', 0, 0, 'auto', 0, 0] } }];
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
                        let msg = `${I18N('THIS_TIME')} ${firstBattle.win ? I18N('VICTORY') : I18N('DEFEAT')}`;
                        if (e.length) {
                            const countWin = e.reduce((w, s) => w + s.win, 0);
                            msg += ` ${I18N('CHANCE_TO_WIN')}: ${Math.floor((countWin / e.length) * 100)}% (${e.length})`;
                        }
                        msg += `, ${min}:${sec}`
                        setProgress(msg, false, hideProgress)
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
                            case 15:
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
                lastBossBattle = call.result.response.battle;
                lastBossBattle.endTime = Date.now() + 160 * 1000;
                if (isChecked('preCalcBattle')) {
                    const result = await Calc(lastBossBattle).then(e => e.progress[0].defenders.heroes[1].extra);
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
                                countTypeReward++;
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

            if (countTypeReward > 20) {
                correctShowOpenArtifact = 3;
            } else {
                correctShowOpenArtifact = 0;
            }

            /**
             * Removing titan cards
             * Убираем карточки титанов
             */
            if (call.ident == callsIdent['titanUseSummonCircle']) {
                if (call.result.response.rewards.length > 10) {
                    for (const reward of call.result.response.rewards) {
                        if (reward.titanCard) {
                            delete reward.titanCard;
                        }
                    }
                    isChange = true;
                }
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
             * Displays player positions in the adventure
             * Отображает позиции игроков в приключении
             */
            if (call.ident == callsIdent['adventure_getLobbyInfo']) {
                const users = Object.values(call.result.response.users);
                const mapIdent = call.result.response.mapIdent;
                const adventureId = call.result.response.adventureId;
                const maps = {
                    adv_strongford_3pl_hell: 9,
                    adv_valley_3pl_hell: 10,
                    adv_ghirwil_3pl_hell: 11,
                    adv_angels_3pl_hell: 12,
                }
                let msg = I18N('MAP') + (mapIdent in maps ? maps[mapIdent] : adventureId);
                msg += '<br>' + I18N('PLAYER_POS');
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
                autoRaidAdventure();
            }
            /** Удаление лавки редкостей */
            if (call.ident == callsIdent['missionRaid']) {
                if (call.result?.heroesMerchant) {
                    delete call.result.heroesMerchant;
                    isChange = true;
                }
            }
            /** missionTimer */
            if (call.ident == callsIdent['missionStart']) {
                missionBattle = call.result.response;
            }
            /** Награды турнира стихий */
            if (call.ident == callsIdent['hallOfFameGetTrophies']) {
                const trophys = call.result.response;
                const calls = [];
                for (const week in trophys) {
                    const trophy = trophys[week];
                    if (!trophy.championRewardFarmed) {
                        calls.push({
                            name: 'hallOfFameFarmTrophyReward',
                            args: { trophyId: week, rewardType: 'champion' },
                            ident: 'body_champion_' + week,
                        });
                    }
                    if (Object.keys(trophy.clanReward).length && !trophy.clanRewardFarmed) {
                        calls.push({
                            name: 'hallOfFameFarmTrophyReward',
                            args: { trophyId: week, rewardType: 'clan' },
                            ident: 'body_clan_' + week,
                        });
                    }
                }
                if (calls.length) {
                    Send({ calls })
                        .then((e) => e.results.map((e) => e.result.response))
                        .then(async results => {
                            let coin18 = 0,
                                coin19 = 0,
                                gold = 0,
                                starmoney = 0;
                            for (const r of results) {
                                coin18 += r?.coin ? +r.coin[18] : 0;
                                coin19 += r?.coin ? +r.coin[19] : 0;
                                gold += r?.gold ? +r.gold : 0;
                                starmoney += r?.starmoney ? +r.starmoney : 0;
                            }

                            let msg = I18N('ELEMENT_TOURNAMENT_REWARD') + '<br>';
                            if (coin18) {
                                msg += cheats.translate('LIB_COIN_NAME_18') + `: ${coin18}<br>`;
                            }
                            if (coin19) {
                                msg += cheats.translate('LIB_COIN_NAME_19') + `: ${coin19}<br>`;
                            }
                            if (gold) {
                                msg += cheats.translate('LIB_PSEUDO_COIN') + `: ${gold}<br>`;
                            }
                            if (starmoney) {
                                msg += cheats.translate('LIB_PSEUDO_STARMONEY') + `: ${starmoney}<br>`;
                            }

                            await popup.confirm(msg, [{ msg: I18N('BTN_OK'), result: 0 }]);
                        });
                }
            }
            if (call.ident == callsIdent['clanDomination_getInfo']) {
                clanDominationGetInfo = call.result.response;
            }
            if (call.ident == callsIdent['clanRaid_endBossBattle']) {
                console.log(call.result.response);
                const damage = Object.values(call.result.response.damage).reduce((a, e) => a + e);
                if (call.result.response.result.afterInvalid) {
                    addProgress('<br>' + I18N('SERVER_NOT_ACCEPT'));
                }
                addProgress('<br>Server > ' + I18N('BOSS_DAMAGE') + damage.toLocaleString());
            }
            if (call.ident == callsIdent['invasion_getInfo']) {
                const r = call.result.response;
                if (r?.actions?.length) {
                    const boss = r.actions.find((e) => e.payload.id === 217);
                    invasionInfo.buff = r.buffAmount;
                    invasionInfo.bossLvl = boss.payload.level;
                }
            }
            if (call.ident == callsIdent['workshopBuff_create']) {
                const r = call.result.response;
                if (r.id == 1) {
                    invasionInfo.buff = r.amount;
                }
            }
            /*
            if (call.ident == callsIdent['chatGetAll'] && call.args.chatType == 'clanDomination' && !callsIdent['clanDomination_mapState']) {
                this.onReadySuccess = async function () {
                    const result = await Send({
                        calls: [
                            {
                                name: 'clanDomination_mapState',
                                args: {},
                                ident: 'clanDomination_mapState',
                            },
                        ],
                    }).then((e) => e.results[0].result.response);
                    let townPositions = result.townPositions;
                    let positions = {};
                    for (let pos in townPositions) {
                        let townPosition = townPositions[pos];
                        positions[townPosition.position] = townPosition;
                    }
                    Object.assign(clanDominationGetInfo, {
                        townPositions: positions,
                    });
                    let userPositions = result.userPositions;
                    for (let pos in clanDominationGetInfo.townPositions) {
                        let townPosition = clanDominationGetInfo.townPositions[pos];
                        if (townPosition.status) {
                            userPositions[townPosition.userId] = +pos;
                        }
                    }
                    cheats.updateMap(result);
                };
            }
            if (call.ident == callsIdent['clanDomination_mapState']) {
                const townPositions = call.result.response.townPositions;
                const userPositions = call.result.response.userPositions;
                for (let pos in townPositions) {
                    let townPos = townPositions[pos];
                    if (townPos.status) {
                        userPositions[townPos.userId] = townPos.position;
                    }
                }
                isChange = true;
            }
            */
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
        } else if (buffType.slice(0, 1) == "-") {
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
            } else if (buffType == 2) {
                for (let i in def) {
                    let state2 = def[i].state;
                    let rState = repleyBattle.state[i];
                    if (!!rState) {
                        state2.hp = rState.hp;
                        state2.energy = rState.energy;
                        state2.isDead = rState.isDead;
                    } else {
                        state2.hp = 0;
                        state2.energy = 0;
                        state2.isDead = true;
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
    // c29tZSBzdHJhbmdlIHN5bWJvbHM=
    /*const quizAPI = new ZingerYWebsiteAPI('getAnswer.php', arguments, { question });
        return new Promise((resolve, reject) => {
            quizAPI.request().then((data) => {
                if (data.result) {
                    resolve(data.result);
                } else {
                    resolve(false);
                }
            }).catch((error) => {
                console.error(error);
                resolve(false);
            });
        })*/
}

/**
 * Submitting a question and answer to a database
 *
 * Отправка вопроса и ответа в базу данных
 */
function sendAnswerInfo(answerInfo) {
    // c29tZSBub25zZW5zZQ==
    /*const quizAPI = new ZingerYWebsiteAPI('setAnswer.php', arguments, { answerInfo });
    quizAPI.request().then((data) => {
        if (data.result) {
            console.log(I18N('SENT_QUESTION'));
        }
    });*/
}

/**
 * Returns the battle type by preset type
 *
 * Возвращает тип боя по типу пресета
 */
function getBattleType(strBattleType) {
    if (!strBattleType) {
        return null;
    }
    switch (strBattleType) {
        case 'titan_pvp':
            return 'get_titanPvp';
        case 'titan_pvp_manual':
        case 'titan_clan_pvp':
        case 'clan_pvp_titan':
        case 'clan_global_pvp_titan':
        case 'brawl_titan':
        case 'challenge_titan':
        case 'titan_mission':
            return 'get_titanPvpManual';
        case 'clan_raid': // Asgard Boss // Босс асгарда
        case 'adventure': // Adventures // Приключения
        case 'clan_global_pvp':
        case 'epic_brawl':
        case 'clan_pvp':
            return 'get_clanPvp';
        case 'dungeon_titan':
        case 'titan_tower':
            return 'get_titan';
        case 'tower':
        case 'clan_dungeon':
            return 'get_tower';
        case 'pve':
        case 'mission':
            return 'get_pve';
        case 'mission_boss':
            return 'get_missionBoss';
        case 'challenge':
        case 'pvp_manual':
            return 'get_pvpManual';
        case 'grand':
        case 'arena':
        case 'pvp':
        case 'clan_domination':
            return 'get_pvp';
        case 'core':
            return 'get_core';
        default: {
            if (strBattleType.includes('invasion')) {
                return 'get_invasion';
            }
            if (strBattleType.includes('boss')) {
                return 'get_boss';
            }
            if (strBattleType.includes('titan_arena')) {
                return 'get_titanPvpManual';
            }
            return 'get_clanPvp';
        }
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
    popup.init();
    scriptMenu.init({
        showMenu: true
    });
    scriptMenu.addHeader(GM_info.script.name, justInfo);
    scriptMenu.addHeader('v' + GM_info.script.version);
}

function addControls() {
    createInterface();
    const checkboxDetails = scriptMenu.addDetails(I18N('SETTINGS'));
    for (let name in checkboxes) {
        if (checkboxes[name].hide) {
            continue;
        }
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
                actionTs: Math.floor(performance.now())
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
            callback(xhr.response, pr);
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
 * Progress added
 *
 * Дополнение прогресса
 */
function addProgress(text) {
    scriptMenu.addStatus(text);
}

/**
 * Returns the timer value depending on the subscription
 *
 * Возвращает значение таймера в зависимости от подписки
 */
function getTimer(time, div) {
    let speedDiv = 5;
    if (subEndTime < Date.now()) {
        speedDiv = div || 1.5;
    }
    return Math.max(Math.ceil(time / speedDiv + 1.5), 4);
}

function startSlave() {
    const sFix = new slaveFixBattle();
    sFix.wsStart();
}

this.testFuntions = {
    hideProgress,
    setProgress,
    addProgress,
    masterFix: false,
    startSlave,
};

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
    this.popUp = [];
    this.downer = [];
    this.middle = [];
    this.msgText = [];
    this.buttons = [];
    this.checkboxes = [];
    this.dialogPromice = null;
    this.isInit = false;

    this.init = function () {
        if (this.isInit) {
            return;
        }
        addStyle();
        addBlocks();
        addEventListeners();
        this.isInit = true;
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
        padding: 15px 9px;
        box-sizing: border-box;
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
        margin: 7px 10px;
        flex-direction: column;
    }

    .PopUp_button {
        background-color: #52A81C;
        border-radius: 5px;
        box-shadow: inset 0px -4px 10px, inset 0px 3px 2px #99fe20, 0px 0px 4px, 0px -3px 1px #d7b275, 0px 0px 0px 3px #ce9767;
        cursor: pointer;
        padding: 4px 12px 6px;
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

    .PopUp_button:active {
        box-shadow: inset 0px 5px 10px, inset 0px 1px 2px #99fe20, 0px 0px 4px, 0px -3px 1px #d7b275, 0px 0px 0px 3px #ce9767;
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
        buttonText.innerHTML = option.msg;
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
            this.dialogPromice = { func: buttonClick, result: option.result };
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
        if (!this.isInit) {
            this.init();
        }
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
                    this.dialogPromice = { func: complete, result: butt.result };
                }
            }
            this.show();
        });
    }

});

/**
 * Script control panel
 *
 * Панель управления скриптом
 */
const scriptMenu = new (function () {

    this.mainMenu = [];
    this.buttons = [];
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
        let style = document.createElement('style');
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
        0px 0px 0px 2px    #ce9767;
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
    .scriptMenu_button:active {
        box-shadow: inset 0px 4px 6px #442901, inset 0px 4px 6px #442901, inset 0px 0px 6px, 0px 0px 4px, 0px 0px 0px 2px #ce9767;
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
            this.status.innerHTML = '';
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

    this.addStatus = (text) => {
        if (!this.status.innerHTML) {
            this.status.classList.remove('scriptMenu_statusHide');
        }
        this.status.innerHTML += text;
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
 * Пример использования
scriptMenu.init();
scriptMenu.addHeader('v1.508');
scriptMenu.addCheckbox('testHack', 'Тестовый взлом игры!');
scriptMenu.addButton('Запуск!', () => console.log('click'), 'подсказака');
scriptMenu.addInputText('input подсказака');
 */
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

    setData(data) {
                this.data = data;
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

class ZingerYWebsiteAPI {

}

//тест парсер подарков
class GiftCodeCollector {
    constructor(filterCodes = []) {
        /** Массив кодов которые возвращать не нужно */
        this.collectedGiftCodes = filterCodes;
        this.codes = [];
    }

    async fetchData() {
        const response = await fetch('https://community-api.hero-wars.com/api/posts/limit/10');
        const data = await response.json();
        return data.data;
    }

    async getGiftCodes() {
        const data = await this.fetchData();
        data.forEach((post) => {
            let code = '';
            post.attributes.body.forEach((body) => {
                if (body.type !== 'paragraph') {
                    return;
                }

                const bodyText = body.data.text;
                const giftUrl = this.getGiftUrl(bodyText);
                const urlText = giftUrl || bodyText;

                const findCode = this.getCodeFromText(urlText);
                if (findCode) {
                    code = findCode;
                }
            });
            if (!code || this.collectedGiftCodes.includes(code)) {
                return;
            }
            this.codes.push(code);
        });
        return this.codes;
    }

    getGiftUrl(text) {
        const regex = /href=([\"\'])(.*?bit\.ly.*?)\1/;
        const matches = text.match(regex);
        return matches ? matches[2] : null;
    }

    getCodeFromText(text) {
        const regex = /gift_id=(\w{10,32})/;
        const matches = text.match(regex);
        return matches ? matches[1] : null;
    }
}

/**
 * Sending expeditions
 *
 * Отправка экспедиций
 */
function checkExpedition() {
    return new Promise((resolve, reject) => {
        const expedition = new Expedition(resolve, reject);
        expedition.start();
    });
}

class Expedition {
    checkExpedInfo = {
        calls: [
            {
                name: 'expeditionGet',
                args: {},
                ident: 'expeditionGet',
            },
            {
                name: 'heroGetAll',
                args: {},
                ident: 'heroGetAll',
            },
        ],
    };

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
        let countGet = 0;
        for (var n in expedInfo) {
            const exped = expedInfo[n];
            const dateNow = Date.now() / 1000;
            if (exped.status == 2 && exped.endTime != 0 && dateNow > exped.endTime) {
                countGet++;
                calls.push({
                    name: 'expeditionFarm',
                    args: { expeditionId: exped.id },
                    ident: 'expeditionFarm_' + exped.id,
                });
            } else {
                dataExped.useHeroes = dataExped.useHeroes.concat(exped.heroes);
            }
            if (exped.status == 1) {
                dataExped.exped.push({ id: exped.id, power: exped.power });
            }
        }
        dataExped.exped = dataExped.exped.sort((a, b) => b.power - a.power);

        /**
         * Putting together a list of heroes
         * Собираем список героев
         */
        const heroesArr = [];
        for (let n in dataHeroes) {
            const hero = dataHeroes[n];
            if (hero.xp > 0 && !dataExped.useHeroes.includes(hero.id)) {
                let heroPower = hero.power;
                // Лара Крофт * 3
                if (hero.id == 63 && hero.color >= 16) {
                    heroPower *= 3;
                }
                heroesArr.push({ id: hero.id, power: heroPower });
            }
        }

        /**
         * Adding expeditions to send
         * Добавляем экспедиции для отправки
         */
        let countSend = 0;
        heroesArr.sort((a, b) => a.power - b.power);
        for (const exped of dataExped.exped) {
            let heroesIds = this.selectionHeroes(heroesArr, exped.power);
            if (heroesIds && heroesIds.length > 4) {
                for (let q in heroesArr) {
                    if (heroesIds.includes(heroesArr[q].id)) {
                        delete heroesArr[q];
                    }
                }
                countSend++;
                calls.push({
                    name: 'expeditionSendHeroes',
                    args: {
                        expeditionId: exped.id,
                        heroes: heroesIds,
                    },
                    ident: 'expeditionSendHeroes_' + exped.id,
                });
            }
        }

        if (calls.length) {
            await Send({ calls });
            this.end(I18N('EXPEDITIONS_SENT', {countGet, countSend}));
            return;
        }

        this.end(I18N('EXPEDITIONS_NOTHING'));
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
    end(msg) {
        setProgress(msg, true);
        this.resolve();
    }
}

/**
 * Passage of the arena of the titans
 *
 * Прохождение арены титанов
 */
function testTitanArena() {
    return new Promise((resolve, reject) => {
        let titAren = new executeTitanArena(resolve, reject);
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
        const countTestBattle = getInput('countTestBattle');
        console.log('resultPreCalcBattle', `${countWin}/${countTestBattle}`)
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
            let rival = rivals[n];
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
        let titanArenaEndRaidCall = {
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
        let results = data.results[0].result.response.results;
        let isSucsesRaid = true;
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
        let titanArenaFarmDailyRewardCall = {
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
    const self = this;
    let selfGame = null;
    let bindId = 1e9;
    this.libGame = null;
    this.doneLibLoad = () => {}

    /**
     * List of correspondence of used classes to their names
     *
     * Список соответствия используемых классов их названиям
     */
    let ObjectsList = [
        { name: 'BattlePresets', prop: 'game.battle.controller.thread.BattlePresets' },
        { name: 'DataStorage', prop: 'game.data.storage.DataStorage' },
        { name: 'BattleConfigStorage', prop: 'game.data.storage.battle.BattleConfigStorage' },
        { name: 'BattleInstantPlay', prop: 'game.battle.controller.instant.BattleInstantPlay' },
        { name: 'MultiBattleInstantReplay', prop: 'game.battle.controller.instant.MultiBattleInstantReplay' },
        { name: 'MultiBattleResult', prop: 'game.battle.controller.MultiBattleResult' },

        { name: 'PlayerMissionData', prop: 'game.model.user.mission.PlayerMissionData' },
        { name: 'PlayerMissionBattle', prop: 'game.model.user.mission.PlayerMissionBattle' },
        { name: 'GameModel', prop: 'game.model.GameModel' },
        { name: 'CommandManager', prop: 'game.command.CommandManager' },
        { name: 'MissionCommandList', prop: 'game.command.rpc.mission.MissionCommandList' },
        { name: 'RPCCommandBase', prop: 'game.command.rpc.RPCCommandBase' },
        { name: 'PlayerTowerData', prop: 'game.model.user.tower.PlayerTowerData' },
        { name: 'TowerCommandList', prop: 'game.command.tower.TowerCommandList' },
        { name: 'PlayerHeroTeamResolver', prop: 'game.model.user.hero.PlayerHeroTeamResolver' },
        { name: 'BattlePausePopup', prop: 'game.view.popup.battle.BattlePausePopup' },
        { name: 'BattlePopup', prop: 'game.view.popup.battle.BattlePopup' },
        { name: 'DisplayObjectContainer', prop: 'starling.display.DisplayObjectContainer' },
        { name: 'GuiClipContainer', prop: 'engine.core.clipgui.GuiClipContainer' },
        { name: 'BattlePausePopupClip', prop: 'game.view.popup.battle.BattlePausePopupClip' },
        { name: 'ClipLabel', prop: 'game.view.gui.components.ClipLabel' },
        { name: 'ClipLabelBase', prop: 'game.view.gui.components.ClipLabelBase' },
        { name: 'Translate', prop: 'com.progrestar.common.lang.Translate' },
        { name: 'ClipButtonLabeledCentered', prop: 'game.view.gui.components.ClipButtonLabeledCentered' },
        { name: 'BattlePausePopupMediator', prop: 'game.mediator.gui.popup.battle.BattlePausePopupMediator' },
        { name: 'SettingToggleButton', prop: 'game.mechanics.settings.popup.view.SettingToggleButton' },
        { name: 'PlayerDungeonData', prop: 'game.mechanics.dungeon.model.PlayerDungeonData' },
        { name: 'NextDayUpdatedManager', prop: 'game.model.user.NextDayUpdatedManager' },
        { name: 'BattleController', prop: 'game.battle.controller.BattleController' },
        { name: 'BattleSettingsModel', prop: 'game.battle.controller.BattleSettingsModel' },
        { name: 'BooleanProperty', prop: 'engine.core.utils.property.BooleanProperty' },
        { name: 'RuleStorage', prop: 'game.data.storage.rule.RuleStorage' },
        { name: 'BattleConfig', prop: 'battle.BattleConfig' },
        { name: 'BattleGuiMediator', prop: 'game.battle.gui.BattleGuiMediator' },
        { name: 'BooleanPropertyWriteable', prop: 'engine.core.utils.property.BooleanPropertyWriteable' },
        { name: 'BattleLogEncoder', prop: 'battle.log.BattleLogEncoder' },
        { name: 'BattleLogReader', prop: 'battle.log.BattleLogReader' },
        { name: 'PlayerSubscriptionInfoValueObject', prop: 'game.model.user.subscription.PlayerSubscriptionInfoValueObject' },
        { name: 'AdventureMapCamera', prop: 'game.mechanics.adventure.popup.map.AdventureMapCamera' },
        { name: 'SendReplayPopUp', prop: 'game.mediator.gui.popup.chat.sendreplay.SendReplayPopUp' }, //полное окно реплей на вг
    ];

    /**
     * Contains the game classes needed to write and override game methods
     *
     * Содержит классы игры необходимые для написания и подмены методов игры
     */
    let Game = {
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
        let battlePresets = new Game.BattlePresets(battleData.progress, !1, !0, Game.DataStorage[getFn(Game.DataStorage, 24)][getF(Game.BattleConfigStorage, battleConfig)](), !1);
        let battleInstantPlay;
        if (battleData.progress?.length > 1) {
            battleInstantPlay = new Game.MultiBattleInstantReplay(battleData, battlePresets);
        } else {
            battleInstantPlay = new Game.BattleInstantPlay(battleData, battlePresets);
        }
        battleInstantPlay[getProtoFn(Game.BattleInstantPlay, 9)].add((battleInstant) => {
            const MBR_2 = getProtoFn(Game.MultiBattleResult, 2);
            const battleResults = battleInstant[getF(Game.BattleInstantPlay, 'get_result')]();
            const battleData = battleInstant[getF(Game.BattleInstantPlay, 'get_rawBattleInfo')]();
            const battleLogs = [];
            const timeLimit = battlePresets[getF(Game.BattlePresets, 'get_timeLimit')]();
            let battleTime = 0;
            let battleTimer = 0;
            for (const battleResult of battleResults[MBR_2]) {
                const battleLog = Game.BattleLogEncoder.read(new Game.BattleLogReader(battleResult));
                battleLogs.push(battleLog);
                const maxTime = Math.max(...battleLog.map((e) => (e.time < timeLimit && e.time !== 168.8 ? e.time : 0)));
                battleTimer += getTimer(maxTime)
                battleTime += maxTime;
            }
            callback({
                battleLogs,
                battleTime,
                battleTimer,
                battleData,
                progress: battleResults[getF(Game.MultiBattleResult, 'get_progress')](),
                result: battleResults[getF(Game.MultiBattleResult, 'get_result')](),
            });
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
    let replaceFunction = {
        company: function () {
            let PMD_12 = getProtoFn(Game.PlayerMissionData, 12);
            let oldSkipMisson = Game.PlayerMissionData.prototype[PMD_12];
            Game.PlayerMissionData.prototype[PMD_12] = function (a, b, c) {
                oldSkipMisson.call(this, a, b, c);
            };

            Game.PlayerMissionData.prototype.P$h = function (a) {
                let GM_2 = getFn(Game.GameModel, 2);
                let GM_P2 = getProtoFn(Game.GameModel, 2);
                let CM_20 = getProtoFn(Game.CommandManager, 20);
                let MCL_2 = getProtoFn(Game.MissionCommandList, 2);
                let MBR_15 = getF(Game.MultiBattleResult, 'get_result');
                let RPCCB_15 = getProtoFn(Game.RPCCommandBase, 16);
                let PMD_32 = getProtoFn(Game.PlayerMissionData, 32);
                Game.GameModel[GM_2]()[GM_P2][CM_20][MCL_2](a[MBR_15]())[RPCCB_15](Game.bindFunc(this, this[PMD_32]));
            };
        },

        // кнопка пропустить
        passBattle: function () {
            let BPP_4 = getProtoFn(Game.BattlePausePopup, 4);
            let oldPassBattle = Game.BattlePausePopup.prototype[BPP_4];
            Game.BattlePausePopup.prototype[BPP_4] = function (a) {
                oldPassBattle.call(this, a);
            };

            let retreatButtonLabel = getF(Game.BattlePausePopupMediator, 'get_retreatButtonLabel');
            let oldFunc = Game.BattlePausePopupMediator.prototype[retreatButtonLabel];
            Game.BattlePausePopupMediator.prototype[retreatButtonLabel] = function () {
                return oldFunc.call(this);
            };
        },
        endlessCards: function () {
            let PDD_21 = getProtoFn(Game.PlayerDungeonData, 21);
            let oldEndlessCards = Game.PlayerDungeonData.prototype[PDD_21];
            Game.PlayerDungeonData.prototype[PDD_21] = function () {
                if (countPredictionCard <= 0) {
                    return true;
                } else {
                    return oldEndlessCards.call(this);
                }
            };
        },
        speedBattle: function () {
            const get_timeScale = getF(Game.BattleController, 'get_timeScale');
            const oldSpeedBattle = Game.BattleController.prototype[get_timeScale];
            Game.BattleController.prototype[get_timeScale] = function () {
                const speedBattle = Number.parseFloat(getInput('speedBattle'));
                if (!speedBattle) {
                    return oldSpeedBattle.call(this);
                }
                try {
                    const BC_12 = getProtoFn(Game.BattleController, 12);
                    const BSM_12 = getProtoFn(Game.BattleSettingsModel, 12);
                    const BP_get_value = getF(Game.BooleanProperty, 'get_value');
                    if (this[BC_12][BSM_12][BP_get_value]()) {
                        return 0;
                    }
                    const BSM_2 = getProtoFn(Game.BattleSettingsModel, 2);
                    const BC_49 = getProtoFn(Game.BattleController, 49);
                    const BSM_1 = getProtoFn(Game.BattleSettingsModel, 1);
                    const BC_14 = getProtoFn(Game.BattleController, 14);
                    const BC_3 = getFn(Game.BattleController, 3);
                    if (this[BC_12][BSM_2][BP_get_value]()) {
                        var a = speedBattle * this[BC_49]();
                    } else {
                        a = this[BC_12][BSM_1][BP_get_value]();
                        const maxSpeed = Math.max(...this[BC_14]);
                        const multiple = a == this[BC_14].indexOf(maxSpeed) ? (maxSpeed >= 4 ? speedBattle : this[BC_14][a]) : this[BC_14][a];
                        a = multiple * Game.BattleController[BC_3][BP_get_value]() * this[BC_49]();
                    }
                    const BSM_24 = getProtoFn(Game.BattleSettingsModel, 24);
                    a > this[BC_12][BSM_24][BP_get_value]() && (a = this[BC_12][BSM_24][BP_get_value]());
                    const DS_23 = getFn(Game.DataStorage, 23);
                    const get_battleSpeedMultiplier = getF(Game.RuleStorage, 'get_battleSpeedMultiplier', true);
                    var b = Game.DataStorage[DS_23][get_battleSpeedMultiplier]();
                    const R_1 = getFn(selfGame.Reflect, 1);
                    const BC_1 = getFn(Game.BattleController, 1);
                    const get_config = getF(Game.BattlePresets, 'get_config');
                    null != b &&
                        (a = selfGame.Reflect[R_1](b, this[BC_1][get_config]().ident)
                            ? a * selfGame.Reflect[R_1](b, this[BC_1][get_config]().ident)
                            : a * selfGame.Reflect[R_1](b, 'default'));
                    return a;
                } catch (error) {
                    console.error('passBatspeedBattletle', error);
                    return oldSpeedBattle.call(this);
                }
            };
        },

        /**
         * Acceleration button without Valkyries favor
         *
         * Кнопка ускорения без Покровительства Валькирий
         */
        battleFastKey: function () {
            const PSIVO_9 = getProtoFn(Game.PlayerSubscriptionInfoValueObject, 9);
            const oldBattleFastKey = Game.PlayerSubscriptionInfoValueObject.prototype[PSIVO_9];
            Game.PlayerSubscriptionInfoValueObject.prototype[PSIVO_9] = function () {
            //const BGM_44 = getProtoFn(Game.BattleGuiMediator, 44);
            //const oldBattleFastKey = Game.BattleGuiMediator.prototype[BGM_44];
            //Game.BattleGuiMediator.prototype[BGM_44] = function () {
                let flag = true;
                //console.log(flag)
                if (flag) {
                    return true;
                } else {
                    return oldBattleFastKey.call(this);
                }
            };
        },
        fastSeason: function () {
            const GameNavigator = selfGame['game.screen.navigator.GameNavigator'];
            const oldFuncName = getProtoFn(GameNavigator, 18);
            const newFuncName = getProtoFn(GameNavigator, 16);
            const oldFastSeason = GameNavigator.prototype[oldFuncName];
            const newFastSeason = GameNavigator.prototype[newFuncName];
            GameNavigator.prototype[oldFuncName] = function (a, b) {
                return oldFastSeason.apply(this, [a, b]);
            };
        },
        ShowChestReward: function () {
            const TitanArtifactChest = selfGame['game.mechanics.titan_arena.mediator.chest.TitanArtifactChestRewardPopupMediator'];
            const getOpenAmountTitan = getF(TitanArtifactChest, 'get_openAmount');
            const oldGetOpenAmountTitan = TitanArtifactChest.prototype[getOpenAmountTitan];
            TitanArtifactChest.prototype[getOpenAmountTitan] = function () {
                if (correctShowOpenArtifact) {
                    correctShowOpenArtifact--;
                    return 100;
                }
                return oldGetOpenAmountTitan.call(this);
            };

            const ArtifactChest = selfGame['game.view.popup.artifactchest.rewardpopup.ArtifactChestRewardPopupMediator'];
            const getOpenAmount = getF(ArtifactChest, 'get_openAmount');
            const oldGetOpenAmount = ArtifactChest.prototype[getOpenAmount];
            ArtifactChest.prototype[getOpenAmount] = function () {
                if (correctShowOpenArtifact) {
                    correctShowOpenArtifact--;
                    return 100;
                }
                return oldGetOpenAmount.call(this);
            };

        },
        fixCompany: function () {
            const GameBattleView = selfGame['game.mediator.gui.popup.battle.GameBattleView'];
            const BattleThread = selfGame['game.battle.controller.thread.BattleThread'];
            const getOnViewDisposed = getF(BattleThread, 'get_onViewDisposed');
            const getThread = getF(GameBattleView, 'get_thread');
            const oldFunc = GameBattleView.prototype[getThread];
            GameBattleView.prototype[getThread] = function () {
                return (
                    oldFunc.call(this) || {
                        [getOnViewDisposed]: async () => {},
                    }
                );
            };
        },
        BuyTitanArtifact: function () {
            const BIP_4 = getProtoFn(selfGame['game.view.popup.shop.buy.BuyItemPopup'], 4);
            const BuyItemPopup = selfGame['game.view.popup.shop.buy.BuyItemPopup'];
            const oldFunc = BuyItemPopup.prototype[BIP_4];
            BuyItemPopup.prototype[BIP_4] = function () {
                oldFunc.call(this);
            };
        },
        ClanQuestsFastFarm: function () {
            const VipRuleValueObject = selfGame['game.data.storage.rule.VipRuleValueObject'];
            const getClanQuestsFastFarm = getF(VipRuleValueObject, 'get_clanQuestsFastFarm', 1);
            VipRuleValueObject.prototype[getClanQuestsFastFarm] = function () {
                return 0;
            };
        },
        adventureCamera: function () {
            const AMC_40 = getProtoFn(Game.AdventureMapCamera, 40);
            const AMC_5 = getProtoFn(Game.AdventureMapCamera, 5);
            const oldFunc = Game.AdventureMapCamera.prototype[AMC_40];
            Game.AdventureMapCamera.prototype[AMC_40] = function (a) {
                this[AMC_5] = 0.4;
                oldFunc.bind(this)(a);
            };
        },
        unlockMission: function () {
            const WorldMapStoryDrommerHelper = selfGame['game.mediator.gui.worldmap.WorldMapStoryDrommerHelper'];
            const WMSDH_4 = getFn(WorldMapStoryDrommerHelper, 4);
            const WMSDH_7 = getFn(WorldMapStoryDrommerHelper, 7);
            WorldMapStoryDrommerHelper[WMSDH_4] = function () {
                return true;
            };
            WorldMapStoryDrommerHelper[WMSDH_7] = function () {
                return true;
            };
        },
        SendReplayPopUp: function() {
        game_view_popup_ClipBasedPopup.prototype.SendReplayPopUp.call(this);
        //if(this.mediator.get_canShareChat()) {
            var clipFull = new game_mediator_gui_popup_chat_sendreplay_SendReplayPopUpClip();
            game_assets_storage_AssetStorage.rsx.popup_theme.get_factory().create(clipFull,game_assets_storage_AssetStorage.rsx.popup_theme.data.getClipByName("send_replay_popup"));
            this.addChild(clipFull.get_graphics());
            clipFull.tf_title.set_text(com_progrestar_common_lang_Translate.translate("UI_DIALOG_CHAT_SEND_REPLAY_TEXT"));
            clipFull.replay_info.tf_label.set_text(com_progrestar_common_lang_Translate.translate("UI_DIALOG_CHAT_REPLAY_TEXT"));
            clipFull.action_btn.set_label(com_progrestar_common_lang_Translate.translate("UI_POPUP_CHAT_SEND"));
            clipFull.tf_message_input.set_prompt(com_progrestar_common_lang_Translate.translate("UI_DIALOG_CHAT_INPUT_MESSAGE_PROMPT"));
            clipFull.tf_message_input.set_text(this.mediator.get_defauiltText());
            clipFull.action_btn.get_signal_click().add($bind(this,this.handler_sendClick));
            clipFull.replay_info.btn_option.get_signal_click().add($bind(this,this.handler_replayClick));
            this.clip = clipFull;
        /*} else {
            var clipShort = new game_mediator_gui_popup_chat_sendreplay_SendReplayPopUpClipShort();
            game_assets_storage_AssetStorage.rsx.popup_theme.get_factory().create(clipShort,game_assets_storage_AssetStorage.rsx.popup_theme.data.getClipByName("send_replay_popup_short"));
            this.addChild(clipShort.get_graphics());
            this.clip = clipShort;
        }*/
        this.clip.button_close.get_signal_click().add(($_=this.mediator,$bind($_,$_.close)));
        this.clip.tf_replay.set_text(com_progrestar_common_lang_Translate.translate("UI_DIALOG_ARENA_REPLAY_URL"));
        this.clip.replay_url_input.set_text(this.mediator.get_replayURL());
        this.clip.replay_url_input.addEventListener("change",$bind(this,this.handler_replayUrlInputChange));
        this.clip.copy_btn.set_label(com_progrestar_common_lang_Translate.translate("UI_DIALOG_BUTTON_COPY"));
        },

    };

    /**
     * Starts replacing recorded functions
     *
     * Запускает замену записанных функций
     */
    this.activateHacks = function () {
        if (!selfGame) throw Error('Use connectGame');
        for (let func in replaceFunction) {
            try {
                replaceFunction[func]();
            } catch (error) {
                console.error(error);
            }
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
        Player[P_24].init(await Send({calls:[{name:"inventoryGet",args:{},ident:"body"}]}).then(e => e.results[0].result.response))
    }
    this.updateInventory = function (reward) {
        const GM_INST = getFnP(Game.GameModel, 'get_instance');
        const GM_0 = getProtoFn(Game.GameModel, 0);
        const P_24 = getProtoFn(selfGame['game.model.user.Player'], 24);
        const Player = Game.GameModel[GM_INST]()[GM_0];
        Player[P_24].init(reward);
    };

    this.updateMap = function (data) {
        const PCDD_21 = getProtoFn(selfGame['game.mechanics.clanDomination.model.PlayerClanDominationData'], 21);
        const P_60 = getProtoFn(selfGame['game.model.user.Player'], 60);
        const GM_0 = getProtoFn(Game.GameModel, 0);
        const getInstance = getFnP(selfGame['Game'], 'get_instance');
        const PlayerClanDominationData = Game.GameModel[getInstance]()[GM_0];
        PlayerClanDominationData[P_60][PCDD_21].update(data);
    };

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
        let navigate = getProtoFn(selfGame["game.screen.navigator.GameNavigator"], 20)
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
        let instance = getFnP(Game.GameModel, 'get_instance')
        let player = Game.GameModel[instance]().A;
        let clanWarSelect = selfGame["game.mechanics.cross_clan_war.popup.selectMode.CrossClanWarSelectModeMediator"];
        new clanWarSelect(player).open();
    }

    /**
     * Go to BrawlShop
     *
     * Переместиться в BrawlShop
     */
    this.goBrawlShop = () => {
        const instance = getFnP(Game.GameModel, 'get_instance')
        const P_36 = getProtoFn(selfGame["game.model.user.Player"], 36);
        const PSD_0 = getProtoFn(selfGame["game.model.user.shop.PlayerShopData"], 0);
        const IM_0 = getProtoFn(selfGame["haxe.ds.IntMap"], 0);
        const PSDE_4 = getProtoFn(selfGame["game.model.user.shop.PlayerShopDataEntry"], 4);

        const player = Game.GameModel[instance]().A;
        const shop = player[P_36][PSD_0][IM_0][1038][PSDE_4];
        const shopPopup = new selfGame["game.mechanics.brawl.mediator.BrawlShopPopupMediator"](player, shop)
        shopPopup.open(new selfGame["game.mediator.gui.popup.PopupStashEventParams"])
    }

    /**
     * Returns all stores from game data
     *
     * Возвращает все магазины из данных игры
     */
    this.getShops = () => {
        const instance = getFnP(Game.GameModel, 'get_instance')
        const P_36 = getProtoFn(selfGame["game.model.user.Player"], 36);
        const PSD_0 = getProtoFn(selfGame["game.model.user.shop.PlayerShopData"], 0);
        const IM_0 = getProtoFn(selfGame["haxe.ds.IntMap"], 0);

        const player = Game.GameModel[instance]().A;
        return player[P_36][PSD_0][IM_0];
    }

    /**
     * Returns the store from the game data by ID
     *
     * Возвращает магазин из данных игры по идетификатору
     */
    this.getShop = (id) => {
        const PSDE_4 = getProtoFn(selfGame["game.model.user.shop.PlayerShopDataEntry"], 4);
        const shops = this.getShops();
        const shop = shops[id]?.[PSDE_4];
        return shop;
    }

    /**
     * Moves to the store with the specified ID
     *
     * Перемещает к магазину с указанным идетификатором
     */
    this.goShopId = function (id) {
        const shop = this.getShop(id);
        if (!shop) {
            return;
        }
        let event = new selfGame["game.mediator.gui.popup.PopupStashEventParams"];
        let Game = selfGame['Game'];
        let navigator = getF(Game, "get_navigator");
        let navigate = getProtoFn(selfGame["game.screen.navigator.GameNavigator"], 21);
        let instance = getFnP(Game, 'get_instance');
        Game[instance]()[navigator]()[navigate](shop, event);
    }

    /**
     * Opens a list of non-standard stores
     *
     * Открывает список не стандартных магазинов
     */
    this.goCustomShops = async (p = 0) => {
        /** Запрос данных нужных магазинов */
        const calls = [{ name: "shopGetAll", args: {}, ident: "shopGetAll" }];
        const shops = lib.getData('shop');
        for (const id in shops) {
            const check = !shops[id].ident.includes('merchantPromo') &&
                ![1, 4, 5, 6, 7, 8, 9, 10, 11, 1023, 1024].includes(+id);
            if (check) {
                calls.push({
                    name: "shopGet", args: { shopId: id }, ident: `shopGet_${id}`
                })
            }
        }
        const result = await Send({ calls }).then(e => e.results.map(n => n.result.response));
        const shopAll = result.shift();
        const DS_32 = getFn(Game.DataStorage, 32)

        const SDS_5 = getProtoFn(selfGame["game.data.storage.shop.ShopDescriptionStorage"], 5)

        const SD_21 = getProtoFn(selfGame["game.data.storage.shop.ShopDescription"], 21);
        const SD_1 = getProtoFn(selfGame["game.data.storage.shop.ShopDescription"], 1);
        const SD_9 = getProtoFn(selfGame["game.data.storage.shop.ShopDescription"], 9);
        const ident = getProtoFn(selfGame["game.data.storage.shop.ShopDescription"], 11);

        for (let shop of result) {
            shopAll[shop.id] = shop;
            // Снимаем все ограничения с магазинов
            const shopLibData = Game.DataStorage[DS_32][SDS_5](shop.id)
            shopLibData[SD_21] = 1;
            shopLibData[SD_1] = new selfGame["game.model.user.requirement.Requirement"]
            shopLibData[SD_9] = new selfGame["game.data.storage.level.LevelRequirement"]({
                teamLevel: 10
            });
        }
        /** Скрываем все остальные магазины */
        for (let id in shops) {
            const shopLibData = Game.DataStorage[DS_32][SDS_5](id)
            if (shopLibData[ident].includes('merchantPromo')) {
                shopLibData[SD_21] = 0;
                shopLibData[SD_9] = new selfGame["game.data.storage.level.LevelRequirement"]({
                    teamLevel: 999
                });
            }
        }

        const instance = getFnP(Game.GameModel, 'get_instance')
        const GM_0 = getProtoFn(Game.GameModel, 0);
        const P_36 = getProtoFn(selfGame["game.model.user.Player"], 36);
        const player = Game.GameModel[instance]()[GM_0];
        /** Пересоздаем объект с магазинами */
        player[P_36] = new selfGame["game.model.user.shop.PlayerShopData"](player);
        player[P_36].init(shopAll);
        /** Даем магазинам новые названия */
        const PSDE_4 = getProtoFn(selfGame["game.model.user.shop.PlayerShopDataEntry"], 4);

        const shopName = getFn(cheats.getShop(1), 14);
        const currentShops = this.getShops();
        let count = 0;
        const start = 9 * p + 1;
        const end = start + 8;
        for (let id in currentShops) {
            const shop = currentShops[id][PSDE_4];
            if ([1, 4, 5, 6, 8, 9, 10, 11].includes(+id)) {
                /** Скрываем стандартные магазины */
                shop[SD_21] = 0;
            } else {
                count++;
                if (count < start || count > end) {
                    shop[SD_21] = 0;
                    continue;
                }
                shop[SD_21] = 1;
                shop[shopName] = cheats.translate("LIB_SHOP_NAME_" + id) + ' ' + id;
                shop[SD_1] = new selfGame["game.model.user.requirement.Requirement"]
                shop[SD_9] = new selfGame["game.data.storage.level.LevelRequirement"]({
                    teamLevel: 10
                });
            }
        }
        console.log(count, start, end)
        /** Отправляемся в городскую лавку */
        this.goShopId(1);
    }

    /**
     * Opens a list of standard stores
     *
     * Открывает список стандартных магазинов
     */
    this.goDefaultShops = async () => {
        const result = await Send({ calls: [{ name: "shopGetAll", args: {}, ident: "shopGetAll" }] })
            .then(e => e.results.map(n => n.result.response));
        const shopAll = result.shift();
        const shops = lib.getData('shop');

        const DS_8 = getFn(Game.DataStorage, 8)
        const DSB_4 = getProtoFn(selfGame["game.data.storage.DescriptionStorageBase"], 4)

        /** Получаем объект валюты магазина для оторажения */
        const coins = Game.DataStorage[DS_8][DSB_4](85);
        coins.__proto__ = selfGame["game.data.storage.resource.ConsumableDescription"].prototype;

        const DS_32 = getFn(Game.DataStorage, 32)
        const SDS_5 = getProtoFn(selfGame["game.data.storage.shop.ShopDescriptionStorage"], 5)

        const SD_21 = getProtoFn(selfGame["game.data.storage.shop.ShopDescription"], 21);
        for (const id in shops) {
            const shopLibData = Game.DataStorage[DS_32][SDS_5](id)
            if ([1, 4, 5, 6, 8, 9, 10, 11].includes(+id)) {
                shopLibData[SD_21] = 1;
            } else {
                shopLibData[SD_21] = 0;
            }
        }

        const instance = getFnP(Game.GameModel, 'get_instance')
        const GM_0 = getProtoFn(Game.GameModel, 0);
        const P_36 = getProtoFn(selfGame["game.model.user.Player"], 36);
        const player = Game.GameModel[instance]()[GM_0];
        /** Пересоздаем объект с магазинами */
        player[P_36] = new selfGame["game.model.user.shop.PlayerShopData"](player);
        player[P_36].init(shopAll);

        const PSDE_4 = getProtoFn(selfGame["game.model.user.shop.PlayerShopDataEntry"], 4);
        const currentShops = this.getShops();
        for (let id in currentShops) {
            const shop = currentShops[id][PSDE_4];
            if ([1, 4, 5, 6, 8, 9, 10, 11].includes(+id)) {
                shop[SD_21] = 1;
            } else {
                shop[SD_21] = 0;
            }
        }
        this.goShopId(1);
    }

    /**
     * Opens a list of Secret Wealth stores
     *
     * Открывает список магазинов Тайное богатство
     */
    this.goSecretWealthShops = async () => {
        /** Запрос данных нужных магазинов */
        const calls = [{ name: "shopGetAll", args: {}, ident: "shopGetAll" }];
        const shops = lib.getData('shop');
        for (const id in shops) {
            if (shops[id].ident.includes('merchantPromo') && shops[id].teamLevelToUnlock <= 130) {
                calls.push({
                    name: "shopGet", args: { shopId: id }, ident: `shopGet_${id}`
                })
            }
        }
        const result = await Send({ calls }).then(e => e.results.map(n => n.result.response));
        const shopAll = result.shift();
        const DS_32 = getFn(Game.DataStorage, 32)

        const SDS_5 = getProtoFn(selfGame["game.data.storage.shop.ShopDescriptionStorage"], 5)

        const SD_21 = getProtoFn(selfGame["game.data.storage.shop.ShopDescription"], 21);
        const SD_1 = getProtoFn(selfGame["game.data.storage.shop.ShopDescription"], 1);
        const SD_9 = getProtoFn(selfGame["game.data.storage.shop.ShopDescription"], 9);
        const ident = getProtoFn(selfGame["game.data.storage.shop.ShopDescription"], 11);
        const specialCurrency = getProtoFn(selfGame["game.data.storage.shop.ShopDescription"], 15);

        const DS_8 = getFn(Game.DataStorage, 8)
        const DSB_4 = getProtoFn(selfGame["game.data.storage.DescriptionStorageBase"], 4)

        /** Получаем объект валюты магазина для оторажения */
        const coins = Game.DataStorage[DS_8][DSB_4](85);
        coins.__proto__ = selfGame["game.data.storage.resource.CoinDescription"].prototype;

        for (let shop of result) {
            shopAll[shop.id] = shop;
            /** Снимаем все ограничения с магазинов */
            const shopLibData = Game.DataStorage[DS_32][SDS_5](shop.id)
            if (shopLibData[ident].includes('merchantPromo')) {
                shopLibData[SD_21] = 1;
                shopLibData[SD_1] = new selfGame["game.model.user.requirement.Requirement"]
                shopLibData[SD_9] = new selfGame["game.data.storage.level.LevelRequirement"]({
                    teamLevel: 10
                });
            }
        }

        /** Скрываем все остальные магазины */
        for (let id in shops) {
            const shopLibData = Game.DataStorage[DS_32][SDS_5](id)
            if (!shopLibData[ident].includes('merchantPromo')) {
                shopLibData[SD_21] = 0;
            }
        }

        const instance = getFnP(Game.GameModel, 'get_instance')
        const GM_0 = getProtoFn(Game.GameModel, 0);
        const P_36 = getProtoFn(selfGame["game.model.user.Player"], 36);
        const player = Game.GameModel[instance]()[GM_0];
        /** Пересоздаем объект с магазинами */
        player[P_36] = new selfGame["game.model.user.shop.PlayerShopData"](player);
        player[P_36].init(shopAll);
        /** Даем магазинам новые названия */
        const PSDE_4 = getProtoFn(selfGame["game.model.user.shop.PlayerShopDataEntry"], 4);

        const shopName = getFn(cheats.getShop(1), 14);
        const currentShops = this.getShops();
        for (let id in currentShops) {
            const shop = currentShops[id][PSDE_4];
            if (shop[ident].includes('merchantPromo')) {
                shop[SD_21] = 1;
                shop[specialCurrency] = coins;
                shop[shopName] = cheats.translate("LIB_SHOP_NAME_" + id) + ' ' + id;
            } else if ([1, 4, 5, 6, 8, 9, 10, 11].includes(+id)) {
                /** Скрываем стандартные магазины */
                shop[SD_21] = 0;
            }
        }
        /** Отправляемся в городскую лавку */
        this.goShopId(1);
    }

    /**
     * Change island map
     *
     * Сменить карту острова
     */
    this.changeIslandMap = (mapId = 2) => {
        const GameInst = getFnP(selfGame['Game'], 'get_instance');
        const GM_0 = getProtoFn(Game.GameModel, 0);
        const P_59 = getProtoFn(selfGame["game.model.user.Player"], 60);
        const PSAD_31 = getProtoFn(selfGame['game.mechanics.season_adventure.model.PlayerSeasonAdventureData'], 31);
        const Player = Game.GameModel[GameInst]()[GM_0];
        Player[P_59][PSAD_31]({ id: mapId, seasonAdventure: { id: mapId, startDate: 1701914400, endDate: 1709690400, closed: false } });

        const GN_15 = getProtoFn(selfGame["game.screen.navigator.GameNavigator"], 17)
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
            self.doneLibLoad(self.libGame);
            try {
                const levels = b.raw.seasonAdventure.level;
                for (const id in levels) {
                    const level = levels[id];
                    level.clientData.graphics.fogged = level.clientData.graphics.visible
                }
                const adv = b.raw.seasonAdventure.list[1];
                adv.clientData.asset = 'dialog_season_adventure_tiles';
            } catch (e) {
                console.warn(e);
            }
            originalStartFunc.call(this, a, b, c);
        }
    }

    this.LibLoad = function() {
        return new Promise((e) => {
            this.doneLibLoad = e;
        });
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
    lastMissionBattleStart = Date.now();
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
     * Запрос на выполнение мисcии
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
         * Расчет данных мисcии
         */
        BattleCalc(e.results[0].result.response, 'get_tower', async r => {
            /** missionTimer */
            let timer = getTimer(r.battleTime) + 5;
            const period = Math.ceil((Date.now() - lastMissionBattleStart) / 1000);
            if (period < timer) {
                timer = timer - period;
                await countdownTimer(timer, `${I18N('MISSIONS_PASSED')}: ${param.count}`);
            }

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

function mergeItemsObj(obj1, obj2) {
    for (const key in obj2) {
        if (obj1[key]) {
            if (typeof obj1[key] == 'object') {
                for (const innerKey in obj2[key]) {
                    obj1[key][innerKey] = (obj1[key][innerKey] || 0) + obj2[key][innerKey];
                }
            } else {
                obj1[key] += obj2[key] || 0;
            }
        } else {
            obj1[key] = obj2[key];
        }
    }

    return obj1;
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
        let letter = letters[l];
        const reward = letter?.reward;
        if (!reward || !Object.keys(reward).length) {
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
        const arePointsMax = infos[1].result.response?.arePointsMax;
        const titansLevel = +(infos[2].result.response?.tier ?? 0);
        const titansStatus = infos[2].result.response?.status; //peace_time || battle

        //}
        //тест убрал подсветку красным в меню
        const imgPortal =
            'data:image/gif;base64,R0lGODlhLwAvAHAAACH5BAEAAP8ALAAAAAAvAC8AhwAAABkQWgjF3krO3ghSjAhSzinF3u+tGWvO3s5rGSmE5gha7+/OWghSrWvmnClShCmUlAiE5u+MGe/W3mvvWmspUmvvGSnOWinOnCnOGWsZjErvnAiUlErvWmsIUkrvGQjOWgjOnAjOGUoZjM6MGe/OIWvv5q1KGSnv5mulGe/vWs7v3ozv3kqEGYxKGWuEWmtSKUrv3mNaCEpKUs7OWiml5ggxWmMpEAgZpRlaCO/35q1rGRkxKWtarSkZrRljKSkZhAjv3msIGRk6CEparQhjWq3v3kql3ozOGe/vnM6tGYytWu9rGWuEGYzO3kqE3gil5s6MWq3vnGvFnM7vWoxrGc5KGYyMWs6tWq2MGYzOnO+tWmvFWkqlWoxrWgAZhEqEWq2tWoytnIyt3krFnGul3mulWmulnEIpUkqlGUqlnK3OnK2MWs7OnClSrSmUte+tnGvFGYytGYzvWs5rWowpGa3O3u/OnErFWoyMnGuE3muEnEqEnIyMGYzOWs7OGe9r3u9rWq3vWq1rWq1r3invWimlWu+t3q0pWq2t3u8pWu8p3q0p3invnCnvGe/vGa2tGa3vGa2tnK0pGe9rnK1rnCmlGe8pGe8pnK0pnGsZrSkp3msp3s7vGYzvnM7vnIzvGc6tnM5r3oxr3gilWs6t3owpWs4pWs4p3owp3s5rnIxrnAilGc4pGc4pnIwpnAgp3kop3s7O3u9KGe+MWoxKWoyM3kIIUgiUte+MnErFGc5KWowIGe9K3u9KWq3OWq1KWq1K3gjvWimEWu+M3q0IWq2M3u8IWu8I3q0I3gjvnAjvGa3OGa2MnK0IGe9KnK1KnCmEGe8IGe8InK0InEoZrSkI3msI3s6MnM5K3oxK3giEWs6M3owIWs4IWs4I3owI3s5KnIxKnAiEGc4IGc4InIwInAgI3koI3kJaCAgQKUIpEGtKUkJSKUIIECla7ylazmtahGta70pa70pahGtazkpazmtrWiExUkprUiljWikQKRkQCAAQCAAACAAAAAj/AP8JHEiwoMGDCBMqXMiwocODJlBIRBHDxMOLBmMEkSjAgICPE2Mw/OUH4z8TGz+agBIBCsuWUAQE0WLwzkAkKZZcnAilhk+fA1bUiEC0ZZABJOD8IyHhwJYDkpakafJQ4kooR5yw0LFihQ4WJhAMKCoARRYSTJgkUOInBZK2DiX2rGHEiI67eFcYATtAAVEoKEiQSFBFDs4UKbg0lGgAigIEeCNzrWvCxIChEcoy3dGiSoITTRQvnCLRrxOveI2McbKahevKJmooiKkFy4Gzg5tMMaMwitwIj/PqGPCugL0CT47ANhEjQg3Atg9IT5CiS4uEUcRIBH4EtREETuB9/xn/BUcBBbBXGGgpoPaBEid23EuXgvdBJhtQGFCwwA7eMgs0gEMDBJD3hR7KbRVbSwP8UcIWJNwjIRLXGZRAAhLVsIACR9y1whMNfNGAHgiUcUSBX8ADWwwKzCYADTSUcMA9ebwQmkFYMMFGhgu80x1XTxSAwxNdGWGCAiG6YQBzly3QkhYxlsDGP1cg4YBBaC0h1zsLPGHXCkfA00AZeu11hALl1VBZXwW0RAaMDGDxTxNdTGEQExJoiUINXCpwmhFOKJCcVmCdOR56MezXJhRvwFlCC2lcWVAUEjBxRobw9HhEXUYekWBlsoVoQEWyFbAAFPRIQQMDJcDQhRhYSv+QZ1kGcAnPYya4BhZYlb1TQ4iI+tVmBPpIQQWrMORxkKwSsEFrDaa+8xgCy1mmgLSHxtDXAhtGMIOxDKjgAkLM7iAAYD4VJ+0RAyAgVl++ikfAESxy62QB365awrjLyprAcxEY4FOmXEp7LbctjlfAAE1yGwEBYBirAgP8GtTUARIMM1QBPrVYQAHF9dgiml/Mexl/3DbAwxnHMqBExQVdLAEMjRXQgHOyydaibPCgqEDH3JrawDosUDExCTATZJuMJ0AAxRNXtLFFPD+P/DB58AC9wH4N4BMxDRPvkPRAbLx3AAlVMLBFCXeQgIaIKJKHQ9X8+forAetMsaoKB7j/MAhCL5j9VFNPJYBGiCGW18CtsvWIs5j7gLEGqyV81gxC6ZBQQgkSMEUCLQckMMLHNhcAD3B+8TdyA0PPACWrB8SH0BItyHAAAwdE4YILTSUww8cELwAyt7D4JSberkd5wA4neIFQE020sMPmJZBwAi0SJMBOA6WTXgAsDYDPOj7r3KNFy5WfkEBCKbTQBQzTM+By5wm4YAPr+LM+IIE27LPOFWswmgqqZ4UEXCEhLUjBGWbgAs3JD2OfWcc68GEDArCOAASwAfnWUYUwtIEKSVCBCiSgPuclpAlImMI9YNDAzeFuMEwQ2w3W4Q530PAGLthBFNqwghCKMAoF3MEB/xNihvr8Ix4sdCCrJja47CVAMFjAwid6eJcQWi8BO4jHQl6AGFjdwwUnOMF75CfCMpoxCTpAoxoZMBgs3qMh7ZODQFYYxgSMsQThCpcK0BiZJNxBCZ7zwhsbYqO3wCoe7AjjCaxAggNUcY94mcDa3qMECWSBHYN0CBfj0IQliEFCMFjkIulAAisUkBZYyB4USxAFCZnkH1xsgltSYCMYyACMpizghS7kOTZIKJMmeYEZzCCH6iCmBS1IRzpkcEsXVMGZMMgHJvfwyoLsYQ9nmMIUuDAFPIAhH8pUZjLbcY89rKKaC9nDFeLxy3vkYwbJTMcL0InOeOSjBVShJz2pqQvPfvrznwANKEMCAgA7';

        setProgress('<img src="' + imgPortal + '" style="height: 25px;position: relative;top: 5px;"> ' + `${portalSphere.amount} </br> ${I18N('GUILD_WAR')}: ${clanWarMyTries}`, true);
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
        let vipLvl = vipInfo[i];
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

async function farmStamina(lootBoxId = 148) {
    const lootBox = await Send('{"calls":[{"name":"inventoryGet","args":{},"ident":"inventoryGet"}]}')
        .then(e => e.results[0].result.response.consumable[148]);

    /** Добавить другие ящики */
    /**
     * 144 - медная шкатулка
     * 145 - бронзовая шкатулка
     * 148 - платиновая шкатулка
     */
    if (!lootBox) {
        setProgress(I18N('NO_BOXES'), true);
        return;
    }

    let maxFarmEnergy = getSaveVal('maxFarmEnergy', 100);
    const result = await popup.confirm(I18N('OPEN_LOOTBOX', { lootBox }), [
        { result: false, isClose: true },
        { msg: I18N('BTN_YES'), result: true },
        { msg: I18N('STAMINA'), isInput: true, default: maxFarmEnergy },
    ]);

    if (!+result) {
        return;
    }

    if ((typeof result) !== 'boolean' && Number.parseInt(result)) {
        maxFarmEnergy = +result;
        setSaveVal('maxFarmEnergy', maxFarmEnergy);
    } else {
        maxFarmEnergy = 0;
    }

    let collectEnergy = 0;
    for (let count = lootBox; count > 0; count--) {
        const response = await Send('{"calls":[{"name":"consumableUseLootBox","args":{"libId":148,"amount":1},"ident":"body"}]}').then(
                        (e) => e.results[0].result.response
                    );
                    const result = Object.values(response).pop();
        if ('stamina' in result) {
            setProgress(`${I18N('OPEN')}: ${lootBox - count}/${lootBox} ${I18N('STAMINA')} +${result.stamina}<br>${I18N('STAMINA')}: ${collectEnergy}`, false);
            console.log(`${ I18N('STAMINA') } + ${ result.stamina }`);
            if (!maxFarmEnergy) {
                return;
            }
            collectEnergy += +result.stamina;
            if (collectEnergy >= maxFarmEnergy) {
                console.log(`${I18N('STAMINA')} + ${ collectEnergy }`);
                setProgress(`${I18N('STAMINA')} + ${ collectEnergy }`, false);
                return;
            }
        } else {
            setProgress(`${I18N('OPEN')}: ${lootBox - count}/${lootBox}<br>${I18N('STAMINA')}: ${collectEnergy}`, false);
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
        { msg: I18N('RAID'), isInput: true, default: portalSphere.amount },
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
    let historyLog = dataClanLog.history;
    for (let j in historyLog) {
        let his = historyLog[j];
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

    runTimeout(func, timeDiff) {
        const worker = new Worker(URL.createObjectURL(new Blob([`
                self.onmessage = function(e) {
                    const timeDiff = e.data;

                    if (timeDiff > 0) {
                        setTimeout(() => {
                            self.postMessage(1);
                            self.close();
                        }, timeDiff);
                    }
                };
            `])));
        worker.postMessage(timeDiff);
        worker.onmessage = () => {
            func();
        };
        return true;
    }

    timeDiff(date1, date2) {
        const date1Obj = new Date(date1);
        const date2Obj = new Date(date2);

        const timeDiff = Math.abs(date2Obj - date1Obj);

        const totalSeconds = timeDiff / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    check() {
        console.log(new Date(this.time))
        if (Date.now() > this.time) {
            this.timeout = null;
            this.start()
            return;
        }
        this.timeout = this.runTimeout(() => this.check(), 6e4);
        return this.timeDiff(this.time, Date.now())
    }

    async start() {
        if (this.timeout) {
            const time = this.timeDiff(this.time, Date.now());
            console.log(new Date(this.time))
            setProgress(I18N('TIMER_ALREADY', { time }), false, hideProgress);
            return;
        }
        setProgress(I18N('EPIC_BRAWL'), false, hideProgress);
        const teamInfo = await Send('{"calls":[{"name":"teamGetAll","args":{},"ident":"teamGetAll"},{"name":"teamGetFavor","args":{},"ident":"teamGetFavor"},{"name":"userGetInfo","args":{},"ident":"userGetInfo"}]}').then(e => e.results.map(n => n.result.response));
        const refill = teamInfo[2].refillable.find(n => n.id == 52)
        this.time = (refill.lastRefill + 3600) * 1000
        const attempts = refill.amount;
        if (!attempts) {
            console.log(new Date(this.time));
            const time = this.check();
            setProgress(I18N('NO_ATTEMPTS_TIMER_START', { time }), false, hideProgress);
            return;
        }

        if (!teamInfo[0].epic_brawl) {
            setProgress(I18N('NO_HEROES_PACK'), false, hideProgress);
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
        const time = this.check();
        setProgress(I18N('EPIC_BRAWL_RESULT', {
            wins, attempts, coins,
            i: '',
            progress: streak.progress,
            nextStage: streak.nextStage,
            end: I18N('ATTEMPT_ENDED', { time }),
        }), false, hideProgress);
    }
}
/* тест остановка подземки*/
function stopDungeon(e) {
   stopDung = true;
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

/**
 * Spin the Seer
 *
 * Покрутить провидца
 */
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


window.sign = a => {
    const i = this['\x78\x79\x7a'];
    return md5([i['\x6e\x61\x6d\x65'], i['\x76\x65\x72\x73\x69\x6f\x6e'], i['\x61\x75\x74\x68\x6f\x72'], ~(a % 1e3)]['\x6a\x6f\x69\x6e']('\x5f'))
}


function getQuestionInfo(img, nameOnly = false) {
    const libHeroes = Object.values(lib.data.hero);
    let heroes;
    let artifacts;
    const parts = img.split(':');
    const id = parts[1];
    switch (parts[0]) {
        case 'titanArtifact_id':
            return cheats.translate("LIB_TITAN_ARTIFACT_NAME_" + id);
        case 'titan':
            return cheats.translate("LIB_HERO_NAME_" + id);
        case 'skill':
            return cheats.translate("LIB_SKILL_" + id);
        case 'inventoryItem_gear':
            return cheats.translate("LIB_GEAR_NAME_" + id);
        case 'inventoryItem_coin':
            return cheats.translate("LIB_COIN_NAME_" + id);
        case 'artifact':
            if (nameOnly) {
                return cheats.translate("LIB_ARTIFACT_NAME_" + id);
            }
            heroes = libHeroes.filter(h => h.id < 100 && h.artifacts.includes(+id));
            return {
                /** Как называется этот артефакт? */
                name: cheats.translate("LIB_ARTIFACT_NAME_" + id),
                /** Какому герою принадлежит этот артефакт? */
                heroes: heroes.map(h => cheats.translate("LIB_HERO_NAME_" + h.id))
            };
        case 'hero':
            if (nameOnly) {
                return cheats.translate("LIB_HERO_NAME_" + id);
            }
            artifacts = lib.data.hero[id].artifacts;
            return {
                /** Как зовут этого героя? */
                name: cheats.translate("LIB_HERO_NAME_" + id),
                /** Какой артефакт принадлежит этому герою? */
                artifact: artifacts.map(a => cheats.translate("LIB_ARTIFACT_NAME_" + a))
            };
    }
}

function hintQuest(quest) {
    const result = {};
    if (quest?.questionIcon) {
        const info = getQuestionInfo(quest.questionIcon);
        if (info?.heroes) {
            /** Какому герою принадлежит этот артефакт? */
            result.answer = quest.answers.filter(e => info.heroes.includes(e.answerText.slice(1)));
        }
        if (info?.artifact) {
            /** Какой артефакт принадлежит этому герою? */
            result.answer = quest.answers.filter(e => info.artifact.includes(e.answerText.slice(1)));
        }
        if (typeof info == 'string') {
            result.info = { name: info };
        } else {
            result.info = info;
        }
    }

    if (quest.answers[0]?.answerIcon) {
        result.answer = quest.answers.filter(e => quest.question.includes(getQuestionInfo(e.answerIcon, true)))
    }

    if ((!result?.answer || !result.answer.length) && !result.info?.name) {
        return false;
    }

    let resultText = '';
    if (result?.info) {
        resultText += I18N('PICTURE') + result.info.name;
    }
    console.log(result);
    if (result?.answer && result.answer.length) {
        resultText += I18N('ANSWER') + result.answer[0].id + (!result.answer[0].answerIcon ? ' - ' + result.answer[0].answerText : '');
    }

    return resultText;
}

async function farmBattlePass() {
    const isFarmReward = (reward) => {
        return !(reward?.buff || reward?.fragmentHero || reward?.bundleHeroReward);
    };

    const battlePassProcess = (pass) => {
        if (!pass.id) {return []}
        const levels = Object.values(lib.data.battlePass.level).filter(x => x.battlePass == pass.id)
        const last_level = levels[levels.length - 1];
        let actual = Math.max(...levels.filter(p => pass.exp >= p.experience).map(p => p.level))

        if (pass.exp > last_level.experience) {
            actual = last_level.level + (pass.exp - last_level.experience) / last_level.experienceByLevel;
        }
        const calls = [];
        for(let i = 1; i <= actual; i++) {
            const level = i >= last_level.level ? last_level : levels.find(l => l.level === i);
            const reward = {free: level?.freeReward, paid:level?.paidReward};

            if (!pass.rewards[i]?.free && isFarmReward(reward.free)) {
                const args = {level: i, free:true};
                if (!pass.gold) { args.id = pass.id }
                calls.push({ name: 'battlePass_farmReward', args, ident: `${pass.gold ? 'body' : 'spesial'}_free_${args.id}_${i}` });
            }
            if (pass.ticket && !pass.rewards[i]?.paid && isFarmReward(reward.paid)) {
                const args = {level: i, free:false};
                if (!pass.gold) { args.id = pass.id}
                calls.push({ name: 'battlePass_farmReward', args, ident: `${pass.gold ? 'body' : 'spesial'}_paid_${args.id}_${i}` });
            }
        }
        return calls;
    }

    const passes = await Send({
        calls: [
            { name: 'battlePass_getInfo', args: {}, ident: 'getInfo' },
            { name: 'battlePass_getSpecial', args: {}, ident: 'getSpecial' },
        ],
    }).then((e) => [{...e.results[0].result.response?.battlePass, gold: true}, ...Object.values(e.results[1].result.response)]);

    const calls = passes.map(p => battlePassProcess(p)).flat()

    if (!calls.length) {
                setProgress(I18N('NOTHING_TO_COLLECT'));
                return;
            }

    let results = await Send({calls});
    if (results.error) {
        console.log(results.error);
        setProgress(I18N('SOMETHING_WENT_WRONG'));
    } else {
        setProgress(I18N('SEASON_REWARD_COLLECTED', {count: results.results.length}), true);
    }
}

async function sellHeroSoulsForGold() {
    let { fragmentHero, heroes } = await Send({
        calls: [
            { name: 'inventoryGet', args: {}, ident: 'inventoryGet' },
            { name: 'heroGetAll', args: {}, ident: 'heroGetAll' },
        ],
    })
        .then((e) => e.results.map((r) => r.result.response))
        .then((e) => ({ fragmentHero: e[0].fragmentHero, heroes: e[1] }));

    const calls = [];
    for (let i in fragmentHero) {
        if (heroes[i] && heroes[i].star == 6) {
            calls.push({
                name: 'inventorySell',
                args: {
                    type: 'hero',
                    libId: i,
                    amount: fragmentHero[i],
                    fragment: true,
                },
                ident: 'inventorySell_' + i,
            });
        }
    }
    if (!calls.length) {
        console.log(0);
        return 0;
    }
    const rewards = await Send({ calls }).then((e) => e.results.map((r) => r.result?.response?.gold || 0));
    const gold = rewards.reduce((e, a) => e + a, 0);
    setProgress(I18N('GOLD_RECEIVED', { gold }), true);
}


class FixBattle {
    minTimer = 1.3;
    maxTimer = 15.3;
    constructor(battle, isTimeout = true) {
        this.battle = structuredClone(battle);
        this.isTimeout = isTimeout;
    }

    timeout(callback, timeout) {
        if (this.isTimeout) {
            this.worker.postMessage(timeout);
            this.worker.onmessage = callback;
        } else {
            callback();
        }
    }

    randTimer() {
        return Math.random() * (this.maxTimer - this.minTimer + 1) + this.minTimer;
    }

    setAvgTime(startTime) {
        this.fixTime += Date.now() - startTime;
        this.avgTime = this.fixTime / this.count;
    }

    init() {
        this.fixTime = 0;
        this.lastTimer = 0;
        this.index = 0;
        this.lastBossDamage = 0;
        this.bestResult = {
            count: 0,
            timer: 0,
            value: 0,
            result: null,
            progress: null,
        };
        this.lastBattleResult = {
            win: false,
        };
        this.worker = new Worker(
            URL.createObjectURL(
                new Blob([
                    `self.onmessage = function(e) {
                            const timeout = e.data;
                            setTimeout(() => {
                                self.postMessage(1);
                            }, timeout);
                        };`,
                ])
            )
        );
    }

    async start(endTime = Date.now() + 6e4, maxCount = 100) {
        this.endTime = endTime;
        this.maxCount = maxCount;
        this.init();
        return await new Promise((resolve) => {
            this.resolve = resolve;
            this.count = 0;
            this.loop();
        });
    }

    endFix() {
        this.bestResult.maxCount = this.count;
        this.worker.terminate();
        this.resolve(this.bestResult);
    }

    async loop() {
        const start = Date.now();
        if (this.isEndLoop()) {
            this.endFix();
            return;
        }
        this.count++;
        try {
            this.lastResult = await Calc(this.battle);
        } catch (e) {
            this.updateProgressTimer(this.index++);
            this.timeout(this.loop.bind(this), 0);
            return;
        }
        const { progress, result } = this.lastResult;
        this.lastBattleResult = result;
        this.lastBattleProgress = progress;
        this.setAvgTime(start);
        this.checkResult();
        this.showResult();
        this.updateProgressTimer();
        this.timeout(this.loop.bind(this), 0);
    }

    isEndLoop() {
        return this.count >= this.maxCount || this.endTime < Date.now();
    }

    updateProgressTimer(index = 0) {
        this.lastTimer = this.randTimer();
        this.battle.progress = [{ attackers: { input: ['auto', 0, 0, 'auto', index, this.lastTimer] } }];
    }

    showResult() {
        console.log(
            this.count,
            this.avgTime.toFixed(2),
            (this.endTime - Date.now()) / 1000,
            this.lastTimer.toFixed(2),
            this.lastBossDamage.toLocaleString(),
            this.bestResult.value.toLocaleString()
        );
    }

    checkResult() {
        const { damageTaken, damageTakenNextLevel } = this.lastBattleProgress[0].defenders.heroes[1].extra;
        this.lastBossDamage = damageTaken + damageTakenNextLevel;
        if (this.lastBossDamage > this.bestResult.value) {
            this.bestResult = {
                count: this.count,
                timer: this.lastTimer,
                value: this.lastBossDamage,
                result: structuredClone(this.lastBattleResult),
                progress: structuredClone(this.lastBattleProgress),
            };
        }
    }

    stopFix() {
        this.endTime = 0;
    }
}

class WinFixBattle extends FixBattle {
    checkResult() {
        if (this.lastBattleResult.win) {
            this.bestResult = {
                count: this.count,
                timer: this.lastTimer,
                value: this.lastBattleResult.stars,
                result: structuredClone(this.lastBattleResult),
                progress: structuredClone(this.lastBattleProgress),
                battleTimer: this.lastResult.battleTimer,
            };
        }
    }

    setWinTimer(value) {
        this.winTimer = value;
    }

    setMaxTimer(value) {
        this.maxTimer = value;
    }

    randTimer() {
        const min = 1.3;
        const max = 30.3;
        return Math.random() * (max - min + 1) + min;
    }

    isEndLoop() {
        return super.isEndLoop() || this.bestResult.result?.win;
    }

    showResult() {
        console.log(
            this.count,
            this.avgTime.toFixed(2),
            (this.endTime - Date.now()) / 1000,
            this.lastResult.battleTime,
            this.lastTimer,
            this.bestResult.value
        );
        const endTime = ((this.endTime - Date.now()) / 1000).toFixed(2);
        const avgTime = this.avgTime.toFixed(2);
        const msg = `${I18N('LETS_FIX')} ${this.count}/${this.maxCount}<br/>${endTime}s<br/>${avgTime}ms`;
        setProgress(msg, false, this.stopFix.bind(this));
    }
}

class BestOrWinFixBattle extends WinFixBattle {
    isNoMakeWin = false;

    getState(result) {
        let beforeSumFactor = 0;
        const beforeHeroes = result.battleData.defenders[0];
        for (let heroId in beforeHeroes) {
            const hero = beforeHeroes[heroId];
            const state = hero.state;
            let factor = 1;
            if (state) {
                const hp = state.hp / (hero?.hp || 1);
                const energy = state.energy / 1e3;
                factor = hp + energy / 20;
            }
            beforeSumFactor += factor;
        }

        let afterSumFactor = 0;
        const afterHeroes = result.progress[0].defenders.heroes;
        for (let heroId in afterHeroes) {
            const hero = afterHeroes[heroId];
            const hp = hero.hp / (beforeHeroes[heroId]?.hp || 1);
            const energy = hero.energy / 1e3;
            const factor = hp + energy / 20;
            afterSumFactor += factor;
        }
        return 100 - Math.floor((afterSumFactor / beforeSumFactor) * 1e4) / 100;
    }

    setNoMakeWin(value) {
        this.isNoMakeWin = value;
    }

    checkResult() {
        const state = this.getState(this.lastResult);
        console.log(state);

        if (state > this.bestResult.value) {
            if (!(this.isNoMakeWin && this.lastBattleResult.win)) {
                this.bestResult = {
                    count: this.count,
                    timer: this.lastTimer,
                    value: state,
                    result: structuredClone(this.lastBattleResult),
                    progress: structuredClone(this.lastBattleProgress),
                    battleTimer: this.lastResult.battleTimer,
                };
            }
        }
    }
}

class BossFixBattle extends FixBattle {
    showResult() {
        super.showResult();
        //setTimeout(() => {
            const best = this.bestResult;
            const maxDmg = best.value.toLocaleString();
            const avgTime = this.avgTime.toLocaleString();
            const msg = `${I18N('LETS_FIX')} ${this.count}/${this.maxCount}<br/>${maxDmg}<br/>${avgTime}ms`;
            setProgress(msg, false, this.stopFix.bind(this));
        //}, 0);
    }
}

class DungeonFixBattle extends FixBattle {
    init() {
        super.init();
        this.isTimeout = false;
    }

    setState() {
        const result = this.lastResult;
        let beforeSumFactor = 0;
        const beforeHeroes = result.battleData.attackers;
        for (let heroId in beforeHeroes) {
            const hero = beforeHeroes[heroId];
            const state = hero.state;
            let factor = 1;
            if (state) {
                const hp = state.hp / (hero?.hp || 1);
                const energy = state.energy / 1e3;
                factor = hp + energy / 20;
            }
            beforeSumFactor += factor;
        }

        let afterSumFactor = 0;
        const afterHeroes = result.progress[0].attackers.heroes;
        for (let heroId in afterHeroes) {
            const hero = afterHeroes[heroId];
            const hp = hero.hp / (beforeHeroes[heroId]?.hp || 1);
            const energy = hero.energy / 1e3;
            const factor = hp + energy / 20;
            afterSumFactor += factor;
        }
        this.lastState = Math.floor((afterSumFactor / beforeSumFactor) * 1e4) / 100;
    }

    checkResult() {
        this.setState();
        if (this.lastResult.result.win && this.lastState > this.bestResult.value) {
            this.bestResult = {
                count: this.count,
                timer: this.lastTimer,
                value: this.lastState,
                result: this.lastResult.result,
                progress: this.lastResult.progress,
            };
        }
    }

    showResult() {
        console.log(
            this.count,
            this.avgTime.toFixed(2),
            (this.endTime - Date.now()) / 1000,
            this.lastTimer.toFixed(2),
            this.lastState.toLocaleString(),
            this.bestResult.value.toLocaleString()
        );
    }
}

const masterWsMixin = {
    wsStart() {
        const socket = new WebSocket(this.url);

        socket.onopen = () => {
            console.log('Connected to server');

            // Пример создания новой задачи
            const newTask = {
                type: 'newTask',
                battle: this.battle,
                endTime: this.endTime - 1e4,
                maxCount: this.maxCount,
            };
            socket.send(JSON.stringify(newTask));
        };

        socket.onmessage = this.onmessage.bind(this);

        socket.onclose = () => {
            console.log('Disconnected from server');
        };

        this.ws = socket;
    },

    onmessage(event) {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'newTask': {
                console.log('newTask:', data);
                this.id = data.id;
                this.countExecutor = data.count;
                break;
            }
            case 'getSolTask': {
                console.log('getSolTask:', data);
                this.endFix(data.solutions);
                break;
            }
            case 'resolveTask': {
                console.log('resolveTask:', data);
                if (data.id === this.id && data.solutions.length === this.countExecutor) {
                    this.worker.terminate();
                    this.endFix(data.solutions);
                }
                break;
            }
            default:
                console.log('Unknown message type:', data.type);
        }
    },

    getTask() {
        this.ws.send(
            JSON.stringify({
                type: 'getSolTask',
                id: this.id,
            })
        );
    },
};

/*
mFix = new action.masterFixBattle(battle)
await mFix.start(Date.now() + 6e4, 1);
*/
class masterFixBattle extends FixBattle {
    constructor(battle, url = 'wss://localho.st:3000') {
        super(battle, true);
        this.url = url;
    }

    async start(endTime, maxCount) {
        this.endTime = endTime;
        this.maxCount = maxCount;
        this.init();
        this.wsStart();
        return await new Promise((resolve) => {
            this.resolve = resolve;
            const timeout = this.endTime - Date.now();
            this.timeout(this.getTask.bind(this), timeout);
        });
    }

    async endFix(solutions) {
        this.ws.close();
        let maxCount = 0;
        for (const solution of solutions) {
            maxCount += solution.maxCount;
            if (solution.value > this.bestResult.value) {
                this.bestResult = solution;
            }
        }
        this.count = maxCount;
        super.endFix();
    }
}

Object.assign(masterFixBattle.prototype, masterWsMixin);
class masterWinFixBattle extends WinFixBattle {
    constructor(battle, url = 'wss://localho.st:3000') {
        super(battle, true);
        this.url = url;
    }

    async start(endTime, maxCount) {
        this.endTime = endTime;
        this.maxCount = maxCount;
        this.init();
        this.wsStart();
        return await new Promise((resolve) => {
            this.resolve = resolve;
            const timeout = this.endTime - Date.now();
            this.timeout(this.getTask.bind(this), timeout);
        });
    }

    async endFix(solutions) {
        this.ws.close();
        let maxCount = 0;
        for (const solution of solutions) {
            maxCount += solution.maxCount;
            if (solution.value > this.bestResult.value) {
                this.bestResult = solution;
            }
        }
        this.count = maxCount;
        super.endFix();
    }
}

Object.assign(masterWinFixBattle.prototype, masterWsMixin);

const slaveWsMixin = {
    wsStop() {
        this.ws.close();
    },

    wsStart() {
        const socket = new WebSocket(this.url);

        socket.onopen = () => {
            console.log('Connected to server');
        };
        socket.onmessage = this.onmessage.bind(this);
        socket.onclose = () => {
            console.log('Disconnected from server');
        };

        this.ws = socket;
    },

    async onmessage(event) {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'newTask': {
                console.log('newTask:', data.task);
                const { battle, endTime, maxCount } = data.task;
                this.battle = battle;
                const id = data.task.id;
                const solution = await this.start(endTime, maxCount);
                this.ws.send(
                    JSON.stringify({
                        type: 'resolveTask',
                        id,
                        solution,
                    })
                );
                break;
            }
            default:
                console.log('Unknown message type:', data.type);
        }
    },
};
/*
sFix = new action.slaveFixBattle();
sFix.wsStart()
*/
class slaveFixBattle extends FixBattle {
    constructor(url = 'wss://localho.st:3000') {
        super(null, false);
        this.isTimeout = false;
        this.url = url;
    }
}

Object.assign(slaveFixBattle.prototype, slaveWsMixin);

class slaveWinFixBattle extends WinFixBattle {
    constructor(url = 'wss://localho.st:3000') {
        super(null, false);
        this.isTimeout = false;
        this.url = url;
    }
}

Object.assign(slaveWinFixBattle.prototype, slaveWsMixin);
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
    let countError = 0;
    let findCoeff = 0;
    let dataNotEeceived = 0;
    let stopAutoBattle = false;

    let isSetWinTimer = false;
    const svgJustice = '<svg width="20" height="20" viewBox="0 0 124 125" xmlns="http://www.w3.org/2000/svg" style="fill: #fff;"><g><path d="m54 0h-1c-7.25 6.05-17.17 6.97-25.78 10.22-8.6 3.25-23.68 1.07-23.22 12.78s-0.47 24.08 1 35 2.36 18.36 7 28c4.43-8.31-3.26-18.88-3-30 0.26-11.11-2.26-25.29-1-37 11.88-4.16 26.27-0.42 36.77-9.23s20.53 6.05 29.23-0.77c-6.65-2.98-14.08-4.96-20-9z"/></g><g><path d="m108 5c-11.05 2.96-27.82 2.2-35.08 11.92s-14.91 14.71-22.67 23.33c-7.77 8.62-14.61 15.22-22.25 23.75 7.05 11.93 14.33 2.58 20.75-4.25 6.42-6.82 12.98-13.03 19.5-19.5s12.34-13.58 19.75-18.25c2.92 7.29-8.32 12.65-13.25 18.75-4.93 6.11-12.19 11.48-17.5 17.5s-12.31 11.38-17.25 17.75c10.34 14.49 17.06-3.04 26.77-10.23s15.98-16.89 26.48-24.52c10.5-7.64 12.09-24.46 14.75-36.25z"/></g><g><path d="m60 25c-11.52-6.74-24.53 8.28-38 6 0.84 9.61-1.96 20.2 2 29 5.53-4.04-4.15-23.2 4.33-26.67 8.48-3.48 18.14-1.1 24.67-8.33 2.73 0.3 4.81 2.98 7 0z"/></g><g><path d="m100 75c3.84-11.28 5.62-25.85 3-38-4.2 5.12-3.5 13.58-4 20s-3.52 13.18 1 18z"/></g><g><path d="m55 94c15.66-5.61 33.71-20.85 29-39-3.07 8.05-4.3 16.83-10.75 23.25s-14.76 8.35-18.25 15.75z"/></g><g><path d="m0 94v7c6.05 3.66 9.48 13.3 18 11-3.54-11.78 8.07-17.05 14-25 6.66 1.52 13.43 16.26 19 5-11.12-9.62-20.84-21.33-32-31-9.35 6.63 4.76 11.99 6 19-7.88 5.84-13.24 17.59-25 14z"/></g><g><path d="m82 125h26v-19h16v-1c-11.21-8.32-18.38-21.74-30-29-8.59 10.26-19.05 19.27-27 30h15v19z"/></g><g><path d="m68 110c-7.68-1.45-15.22 4.83-21.92-1.08s-11.94-5.72-18.08-11.92c-3.03 8.84 10.66 9.88 16.92 16.08s17.09 3.47 23.08-3.08z"/></g></svg>';
    const svgBoss = '<svg width="20" height="20" viewBox="0 0 40 41" xmlns="http://www.w3.org/2000/svg" style="fill: #fff;"><g><path d="m21 12c-2.19-3.23 5.54-10.95-0.97-10.97-6.52-0.02 1.07 7.75-1.03 10.97-2.81 0.28-5.49-0.2-8-1-0.68 3.53 0.55 6.06 4 4 0.65 7.03 1.11 10.95 1.67 18.33 0.57 7.38 6.13 7.2 6.55-0.11 0.42-7.3 1.35-11.22 1.78-18.22 3.53 1.9 4.73-0.42 4-4-2.61 0.73-5.14 1.35-8 1m-1 17c-1.59-3.6-1.71-10.47 0-14 1.59 3.6 1.71 10.47 0 14z"/></g><g><path d="m6 19c-1.24-4.15 2.69-8.87 1-12-3.67 4.93-6.52 10.57-6 17 5.64-0.15 8.82 4.98 13 8 1.3-6.54-0.67-12.84-8-13z"/></g><g><path d="m33 7c0.38 5.57 2.86 14.79-7 15v10c4.13-2.88 7.55-7.97 13-8 0.48-6.46-2.29-12.06-6-17z"/></g></svg>';
    const svgAttempt = '<svg width="20" height="20" viewBox="0 0 645 645" xmlns="http://www.w3.org/2000/svg" style="fill: #fff;"><g><path d="m442 26c-8.8 5.43-6.6 21.6-12.01 30.99-2.5 11.49-5.75 22.74-8.99 34.01-40.61-17.87-92.26-15.55-133.32-0.32-72.48 27.31-121.88 100.19-142.68 171.32 10.95-4.49 19.28-14.97 29.3-21.7 50.76-37.03 121.21-79.04 183.47-44.07 16.68 5.8 2.57 21.22-0.84 31.7-4.14 12.19-11.44 23.41-13.93 36.07 56.01-17.98 110.53-41.23 166-61-20.49-59.54-46.13-117.58-67-177z"/></g><g><path d="m563 547c23.89-16.34 36.1-45.65 47.68-71.32 23.57-62.18 7.55-133.48-28.38-186.98-15.1-22.67-31.75-47.63-54.3-63.7 1.15 14.03 6.71 26.8 8.22 40.78 12.08 61.99 15.82 148.76-48.15 183.29-10.46-0.54-15.99-16.1-24.32-22.82-8.2-7.58-14.24-19.47-23.75-24.25-4.88 59.04-11.18 117.71-15 177 62.9 5.42 126.11 9.6 189 15-4.84-9.83-17.31-15.4-24.77-24.23-9.02-7.06-17.8-15.13-26.23-22.77z"/></g><g><path d="m276 412c-10.69-15.84-30.13-25.9-43.77-40.23-15.39-12.46-30.17-25.94-45.48-38.52-15.82-11.86-29.44-28.88-46.75-37.25-19.07 24.63-39.96 48.68-60.25 72.75-18.71 24.89-42.41 47.33-58.75 73.25 22.4-2.87 44.99-13.6 66.67-13.67 0.06 22.8 10.69 42.82 20.41 62.59 49.09 93.66 166.6 114.55 261.92 96.08-6.07-9.2-22.11-9.75-31.92-16.08-59.45-26.79-138.88-75.54-127.08-151.92 21.66-2.39 43.42-4.37 65-7z"/></g></svg>';

    this.start = function (battleArgs, battleInfo) {
        battleArg = battleArgs;
        if (nameFuncStartBattle == 'invasion_bossStart') {
                        startBattle();
                        return;
                    }
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
        // setProgress(countBattle + '/' + countMaxBattle);
        if (countBattle > countMaxBattle) {
            setProgress(`${I18N('RETRY_LIMIT_EXCEEDED')}: ${countMaxBattle}`, true);
            endAutoBattle(`${I18N('RETRY_LIMIT_EXCEEDED')}: ${countMaxBattle}`)
            return;
        }
        if (stopAutoBattle) {
            setProgress(I18N('STOPPED'), true);
            endAutoBattle('STOPPED');
            return;
        }
        send({calls: [{
            name: nameFuncStartBattle,
            args: battleArg,
            ident: "body"
        }]}, calcResultBattle);
    }
    /**
     * Battle calculation
     *
     * Расчет боя
     */
    async function calcResultBattle(e) {
        if ('error' in e) {
            if (e.error.description === 'too many tries') {
                invasionTimer += 100;
                countBattle--;
                countError++;
                console.log(`Errors: ${countError}`, e.error);
                startBattle();
                return;
            }
            const result = await popup.confirm(I18N('ERROR_DURING_THE_BATTLE') + '<br>' + e.error.description, [
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
        lastBattleInfo = battle;
        BattleCalc(battle, getBattleType(battle.type), resultBattle);
    }
    /**
     * Processing the results of the battle
     *
     * Обработка результатов боя
     */
    async function resultBattle(e) {
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
            if (nameFuncStartBattle == 'invasion_bossStart') {
                const bossLvl = lastBattleInfo.typeId >= 130 ? lastBattleInfo.typeId : '';
                const justice = lastBattleInfo?.effects?.attackers?.percentInOutDamageModAndEnergyIncrease_any_99_100_300_99_1000_300 || 0;
                setProgress(`${svgBoss} ${bossLvl} ${svgJustice} ${justice} <br>${svgAttempt} ${countBattle}/${countMaxBattle}`, false, () => {
                    stopAutoBattle = true;
                });
                await new Promise((resolve) => setTimeout(resolve, 5000));
            } else {
                setProgress(`${countBattle}/${countMaxBattle}`);
            }
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
                let hero = heroes[ids];
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
                const bossLvl = lastBattleInfo.typeId >= 130 ? lastBattleInfo.typeId : '';
                const justice = lastBattleInfo?.effects?.attackers?.percentInOutDamageModAndEnergyIncrease_any_99_100_300_99_1000_300 || 0;
                let winTimer = '';
                if (nameFuncStartBattle == 'invasion_bossStart') {
                    winTimer = '<br>Secret number: ' + battleResult.progress[0].attackers.input[5];
                }

                const result = await popup.confirm(
                    I18N('BOSS_HAS_BEEN_DEF_TEXT', {
                        bossLvl: `${svgBoss} ${bossLvl} ${svgJustice} ${justice}`,
                        countBattle: svgAttempt + ' ' + countBattle,
                        countMaxBattle,}),
                        winTimer,
                [
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


// run the dungeon to the end
function DungeonFull() {
        return new Promise((resolve, reject) => {
            const dung = new executeDungeon(resolve, reject);
            const titanit = getInput('countTitanit');
            dung.start(titanit);
        });
    }

/** iterate through the dungeon */
function executeDungeon(resolve, reject) {
        let dungeonActivity = 0;
        let startDungeonActivity = 0;
        let maxDungeonActivity = 150;
        let limitDungeonActivity = 30180;
        let slowMode = false;
        let slowModeLimit = 50;
        let countShowStats = 1;
        //let fastMode = isChecked('fastMode');
        let end = false;
        let endOLD = false;

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

        let backups = [];

        //тест
        let talentMsg = '';
        let talentMsgReward = ''

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
            slowMode = isChecked('slowMode');
            slowModeLimit = getInput('slowModeLimit');
            if (isChecked('startNewDungeon')) {
                send(JSON.stringify(callsExecuteDungeon), startDungeon);
            } else {
                send(JSON.stringify(callsExecuteDungeon), startDungeonOLD);
            }
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
            console.log("Start digging: ", new Date());
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
            teams.empty = { // for backup teams, never needs refreshing on checkFloor
                favor: {},
                heroes: [],
                teamNum: 0,
            };
            checkFloor(dungeonGetInfo);
        }

        function getTitanTeam(type) {
            switch (type) {
                case 'neutral':
                    return [4023, 4022, 4012, 4021, 4011, 4010, 4020]
                        .filter(e => !titansStates[e]?.isDead);
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
            checkTalent(dungeonInfo);
            // console.log(dungeonInfo, dungeonActivity);
            setProgress(`${I18N('DUNGEON2')}: ${I18N('TITANIT')} ${dungeonActivity}/${maxDungeonActivity} ${talentMsg}`);
            //setProgress('Dungeon: Титанит ' + dungeonActivity + '/' + maxDungeonActivity);
            if (dungeonActivity >= maxDungeonActivity) {
                endDungeon('Stop digging', 'titanite collected: ' + dungeonActivity + '/' + maxDungeonActivity);
                return;
            }
            let activity = dungeonActivity - startDungeonActivity;
            titansStates = dungeonInfo.states.titans;
            if (stopDung){
                endDungeon('Stop digging,', 'titanite collected: ' + dungeonActivity + '/' + maxDungeonActivity);
                return;
            }
            // refresh dead titans
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
            bestBattle = {};
            let bestAttackerType = null;
            let bestRecovery = {'recov': -10000, 'remain': -5};
            bestBattle.recovery = {'recov': -10000, 'remain': -5};
            bestBattle.selectedTeamNum = -1;
            bestBattle.attackers = null;
            let bestTeamNum = 0;
            let floorChoices = dungeonInfo.floor.userData;
            if (floorChoices.length > 1) {
                for (let element in teams) {
                    let teamNum = findElement(floorChoices, element);
                    if (!!teamNum) {
                        switch (element) {
                            case 'earth':
                                if (teams.earth.heroes.length == 0) {
                                    console.log("Cannot try earth team because it's dead");
                                    continue;
                                }
                                break;
                            case 'fire':
                                if (teams.fire.heroes.length == 0) {
                                    console.log("Cannot try fire team because it's dead");
                                    continue;
                                }
                                break;
                            case 'water':
                                if (teams.water.heroes.length == 0) {
                                    console.log("Cannot try water team because it's dead");
                                    continue;
                                }
                                break;
                        }
                        await attemptElement(floorChoices[teamNum].attackerType, teamNum);
                        if (bestBattle.recovery.recov > bestRecovery.recov) {
                            if (bestBattle.recovery.recov > 0 || (bestRecovery.remain < bestBattle.recovery.remain)) {
                                bestRecovery = bestBattle.recovery;
                                bestTeamNum = teamNum;
                                bestAttackerType = floorChoices[teamNum].attackerType;
                                console.log("New best battle found", bestAttackerType);
                            } else {
                                console.log("Found better recovery: ", bestBattle.recovery, " but previous remaining hp percentage is better: ", bestRecovery);
                            }
                        } else {
                            console.log("Old best recovery: ", bestRecovery.recov, " still best, last checked element is: ", element, " bestBattle.recovery is: ", bestBattle.recovery.recov);
                        }
                    }
                }
                if (!!bestAttackerType) {
                    bestBattle.recovery = bestRecovery; // if neutral nonsense ruined this, restore it
                    chooseElement(bestAttackerType, bestTeamNum);
                } else {
                    endDungeon("Could not find viable attack", dungeonInfo);
                }
            } else {
                chooseElement(floorChoices[0].attackerType, 0);
            }
        }
        //тест черепахи
        async function checkTalent(dungeonInfo) {
            const talent = dungeonInfo.talent;
            if (!talent) {
                return;
            }
            const dungeonFloor = +dungeonInfo.floorNumber;
            const talentFloor = +talent.floorRandValue;
            let doorsAmount = 3 - talent.conditions.doorsAmount;

            if (dungeonFloor === talentFloor && (!doorsAmount || !talent.conditions?.farmedDoors[dungeonFloor])) {
                const reward = await Send({
                    calls: [
                        { name: 'heroTalent_getReward', args: { talentType: 'tmntDungeonTalent', reroll: false }, ident: 'group_0_body' },
                        { name: 'heroTalent_farmReward', args: { talentType: 'tmntDungeonTalent' }, ident: 'group_1_body' },
                    ],
                }).then((e) => e.results[0].result.response);
                const type = Object.keys(reward).pop();
                const itemId = Object.keys(reward[type]).pop();
                const count = reward[type][itemId];
                const itemName = cheats.translate(`LIB_${type.toUpperCase()}_NAME_${itemId}`);
                talentMsgReward += `<br> ${count} ${itemName}`;
                doorsAmount++;
            }
            talentMsg = `<br>TMNT Talent: ${doorsAmount}/3 ${talentMsgReward}<br>`;
        }

        /** Попытка атаки землей и огнем */
        async function attemptAttackElemental(teamNum, attackerType, attempt) {
            let start = new Date();
            let team = clone(teams[attackerType]);
            let removeIndex = attempt - 1;
            if (removeIndex >= 0) {
                team.heroes.splice(removeIndex, 1); // no point trying fewer titans, doomed for failure
            }
            if (team.heroes.length == 0) return -1;
            let attempts = 25;
            if (attackerType == 'water') attempts = 1;
            let recovery = await getBestRecovery(teamNum, attackerType, team, attempts);
            if (recovery.recov > bestBattle.recovery.recov) {
                if (bestBattle.selectedTeamNum == teamNum || recovery.recov > 0 || (recovery.remain > bestBattle.recovery.remain)) {
                    bestBattle.recovery = recovery;
                    bestBattle.selectedTeamNum = teamNum;
                    bestBattle.team = team;
                }
            }
            let workTime = new Date().getTime() - start.getTime();
            timeDungeon.attackEarthOrFire += workTime;

            return bestBattle.selectedTeamNum;
        }

        // if you need to try removing 2 or 3 titans
        async function attemptAttacksElementalSlowMode(teamNum, attackerType) {
            let start = new Date();
            let numTitans = teams[attackerType].heroes.length;
            if (numTitans < 3) return bestBattle.selectedTeamNum;
            for (let i = 0; i < numTitans - 1; ++i) {
                for (let j = i+1; j < numTitans; ++j) {
                    if (teams[attackerType].heroes.length == 2) break;
                    let team = clone(teams[attackerType]);
                    team.heroes.splice(j, 1); // splice j first so i doesn't change
                    team.heroes.splice(i, 1);
                    let attempts = 25;
                    if (attackerType == 'water') attempts = 1;
                    let recovery = await getBestRecovery(teamNum, attackerType, team, attempts);
                    if (recovery.recov > bestBattle.recovery.recov) {
                        if (bestBattle.selectedTeamNum == teamNum || recovery.recov > 0 || (recovery.remain > bestBattle.recovery.remain)) {
                            bestBattle.recovery = recovery;
                            bestBattle.selectedTeamNum = teamNum;
                            bestBattle.team = team;
                        }
                    }
                    for (let k = i - 1; k >= 0 && numTitans == 4; --k) { // only starts when i moves on
                        let newTeam = clone(team);
                        newTeam.splice(k, 1);
                        let recovery = await getBestRecovery(teamNum, attackerType, newTeam, attempts);
                        if (recovery.recov > bestBattle.recovery.recov) {
                            if (bestBattle.selectedTeamNum == teamNum || recovery.recov > 0 || (recovery.remain > bestBattle.recovery.remain)) {
                                bestBattle.recovery = recovery;
                                bestBattle.selectedTeamNum = teamNum;
                                bestBattle.team = newTeam;
                            }
                        }
                    }
                }
            }
            let workTime = new Date().getTime() - start.getTime();
            timeDungeon.attackEarthOrFire += workTime;
            return bestBattle.selectedTeamNum;
        }

        async function attemptElement(attackerType, teamNum) {
            let result;
            console.log("attempt", attackerType, teamNum);
            if (!!teams[attackerType].heroes && teams[attackerType].heroes.length == 0) {
                console.log("cannot attempt, no titans");
                return;
            } else if (!teams[attackerType].heroes && !teams[attackerType].length) {
                console.log("no heroes field, but also no team obj length");
                return;
            }
            switch (attackerType) {
                case 'hero':
                    console.log("Hero battles should never reach attemptElement!!!");
                    result = await startBattle(teamNum, attackerType, teams[attackerType]);
                    break;
                case 'water':
                case 'earth':
                case 'fire':
                    result = await attackElemental(teamNum, attackerType);
                    break;
                case 'neutral':
                    result = await attackNeutral(teamNum, attackerType);
            }
            if (!!result && attackerType != 'hero') {
                let titans = result.progress[0].attackers.heroes;
                console.log("The battle was attempted: " + attackerType +
                            ", recovery: ", bestBattle.recovery.recov, "\r\nTitans remaining: ", titans);
                if (titans.length != result.heroes.length) {
                    console.log("Titans started: ", result.heroes);
                }
            }
        }

        /** Выбираем стихию для атаки */
        async function chooseElement(attackerType, teamNum) {
            let result;
            console.log("choose ", attackerType, teamNum);
            switch (attackerType) {
                case 'hero':
                    result = await startBattle(teamNum, attackerType, teams[attackerType]);
                    break;
                case 'water':
                case 'earth':
                case 'fire':
                    result = await attackElemental(teamNum, attackerType);
                    break;
                case 'neutral':
                    result = await attackNeutral(teamNum, attackerType);
            }
            if (!!result && attackerType != 'hero') {
                let titans = result.progress[0].attackers.heroes;
                console.log("The battle was fought: " + attackerType +
                            ", recovery: ", bestBattle.recovery, "titans remaining:", titans);
            }
            endBattle(result);
        }

        function getElementMatch(titan, attackerType) {
            // second to last digit
            let element = Math.round((titan / 10) % 10);
            switch(attackerType) {
                case 'water':
                    return element == 0;
                case 'fire':
                    return element == 1;
                case 'earth':
                    return element == 2;
            }
            return false;
        }

        /** Attack with a non-neutral team */
        async function attackElemental(teamNum, attackerType) {
            let selectedTeamNum = -1;
            // always attempt all team slices
            for (let attempt = 0; attempt <= teams[attackerType].heroes.length; attempt++) {
                selectedTeamNum = await attemptAttackElemental(teamNum, attackerType, attempt);
                if (bestBattle.recovery.recov >= 0 && !slowMode) break;
            }
            if (slowMode || bestBattle.recovery.recov <= -10000) {
                selectedTeamNum = await attemptAttacksElementalSlowMode(teamNum, attackerType);
            }
            // attackNeutral only sets bestBattle.attackers and bestBattle.team is set by attackElemental. So neutral attempts will not overwrite this if an element was better
            if (!!bestBattle.team && !!bestBattle.team.heroes && bestBattle.team.heroes.length < 5 && getElementMatch(bestBattle.team.heroes[0], attackerType)) {
                return findAttack(teamNum, attackerType, bestBattle.team);
            } else if (!!bestBattle.team && !!bestBattle.team.heroes) {
                console.log("No best team found for attackElemental. Best is ", bestBattle.team.heroes, " but attacker type is ", attackerType);
                return null;
            } else {
                console.log("No best team found for attackElemental for type ", attackerType);
                if (!!bestBattle.team) {
                    console.log("Best is neutral");
                }
            }
        }

        /** Находим подходящий результат для атаки */
        async function findAttack(teamNum, attackerType, team) {
            team.teamNum = teamNum;
            let start = new Date();
            let recovery = {'recov': -10000, 'remain': -5};
            let iterations = 0;
            let result;
            let correction = 0.01;
            console.log("need recovery of at least ", bestBattle.recovery.recov, "for team ", team);
            for (let needRecovery = bestBattle.recovery.recov; recovery.recov < needRecovery; needRecovery -= correction, iterations++) {
                result = await startBattle(teamNum, attackerType, team);
                recovery = getRecovery(result);
            }
            console.log("found final recovery of ", recovery);
            bestBattle.recovery = recovery;
            let workTime = new Date().getTime() - start.getTime();
            timeDungeon.findAttack += workTime;
            return result;
        }

        /** Атакуем Нейтральной командой */
        async function attackNeutral(teamNum, attackerType) {
            let start = new Date();
            let factors = calcFactor();
            let savedRecovery = bestBattle.recovery;
            let savedAttackers = bestBattle.attackers;
            bestBattle.recovery = {'recov': -10000, 'remain': -5};
            bestBattle.attackers = null;
            await findBestBattleNeutral(teamNum, attackerType, factors, 0);
            if (bestBattle.recovery.recov < 0 || (bestBattle.recovery.recov < 0.2 && factors[0].value < 0.5)) {
                console.log("Couldn't find a successful fight in quick mode: " + attackerType +
                            ", recovery: ", bestBattle.recovery, bestBattle.attackers);
                await findBestBattleNeutral(teamNum, attackerType, factors, 1);
                if (bestBattle.recovery.recov < -1) {
                    console.log("Couldn't find a successful fight in full water mode, recovery: ", bestBattle.recovery, bestBattle.attackers);
                    await findBestBattleNeutral(teamNum, attackerType, factors, 2);
                }
            }
            console.log("Final fight stats: ", bestBattle.recovery, bestBattle.attackers);
            if (savedRecovery.recov > bestBattle.recovery.recov && !!savedAttackers) { // came from attemptNeutral, sometimes due to Eden this happens but it's too costly to 25x refight every battle that includes Eden
                console.log("previous saved fight is better: ", savedRecovery, savedAttackers);
                bestBattle.recovery = savedRecovery;
                bestBattle.attackers = savedAttackers;
            }
            let workTime = new Date().getTime() - start.getTime();
            timeDungeon.attackNeutral += workTime;
            if (!!bestBattle.attackers && bestBattle.selectedTeamNum == teamNum) {
                let team = getTeam(bestBattle.attackers);
                console.log("Finding attack with team ", team);
                if (team.length > 0 || (!!team.heroes && team.heroes.length > 0)) return findAttack(teamNum, attackerType, team);
            }
            console.log('Could not find a good fight!', attackerType);
            return undefined;
        }

        /** Находит лучшую нейтральную команду */
        async function findBestBattleNeutral(teamNum, attackerType, factors, mode) {
            let countFactors = factors.length < 4 ? factors.length : 4;
            let aradgi = !titansStates['4013']?.isDead;
            let edem = !titansStates['4023']?.isDead;
            let dark = [4032, 4033].filter(e => !titansStates[e]?.isDead);
            let light = [4042].filter(e => !titansStates[e]?.isDead);
            // start with healing titans, then supertitans, then light/dark trash, then other trash, then the water titans which are at the biggest risk of permanent death
            // filtered once here and used in getNeutralTeam to pad out teams to 5
            backups = [4003, 4032, 4033, 4042, 4043, 4023, 4013, 4041, 4040, 4031, 4030, 4022, 4021, 4020, 4012, 4011, 4010, 4000, 4001, 4002].filter(e => !titansStates[e]?.isDead);
            let actions = [];
            if (mode == 0) {
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
            } else if (mode == 1) {
                countFactors = factors.length < 2 ? factors.length : 2;

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
                        console.log("light.length is ",light.length," should NEVER happen");
                        let secondId = light[j];
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4001, secondId)));
                        actions.push(startBattle(teamNum, attackerType, getNeutralTeam(firstId, 4002, secondId)));
                    }
                }
            } else if (mode == 2) {
                if (!slowMode) {
                    // just iterate through backups to see if any sequential options are better than the previous attempts
                    for (let i = 0; i < backups.length - 5; ++i) {
                        actions.push(startBattle(teamNum, attackerType, getBackupTeam(i)));
                    }
                } else {
                    // HAHAHAHAHAH I'M INSANE FOR ADDING THIS
                    runBackupTeamsSlowMode(teamNum, attackerType, actions);
                }
            }
            for (let result of await Promise.all(actions)) {
                if (!result || !result.progress[0].attackers.heroes || (Object.keys(result.progress[0].attackers.heroes).length == 0)) {
                    continue; // everyone died
                }
                let recovery = getRecovery(result);
                if (recovery.recov > bestBattle.recovery.recov) {
                    if (recovery.recov > 0 || (recovery.remain > bestBattle.recovery.remain)) {
                        bestBattle.recovery = recovery;
                        bestBattle.attackers = result.battleData.attackers;
                        bestBattle.selectedTeamNum = teamNum;
                    }
                }
            }
        }

        // basic function to iterate through backup hero list to find good teams
        function getBackupTeam(startId) {
            let neutralTeam = clone(teams.empty);
            let neutral = neutralTeam.heroes;
            let i = 0;
            while (neutral.length < 5 && i < backups.length) {
                if (!neutral.includes(backups[i+startId])) {
                    neutral.push(backups[i+startId]);
                }
                ++i;
            }
            return neutralTeam;
        }

        // iterates through all 15504 possible teams if necessary to avoid titan deaths
        async function runBackupTeamsSlowMode(teamNum, attackerType, actions) {
            let count = 0;
            for (let i = 0; i < backups.length - 4; ++i) {
                for (let j = i+1; j < backups.length - 3; ++j) {
                    for (let k = j+1; k < backups.length - 2; ++k) {
                        for (let l = k+1; l < backups.length - 1; ++l) {
                            for (let m = l+1; m < backups.length; ++m) {
                                let team = clone(teams.empty);
                                let heroes = team.heroes;
                                heroes.push(backups[i]);
                                heroes.push(backups[j]);
                                heroes.push(backups[k]);
                                heroes.push(backups[l]);
                                heroes.push(backups[m]);
                                actions.push(startBattle(teamNum, attackerType, team));
                                if (actions.length >= slowModeLimit) {
                                    for (let result of await Promise.all(actions)) {
                                        ++count;
                                        if (!result || !result.progress[0].attackers.heroes || (Object.keys(result.progress[0].attackers.heroes).length == 0)) {
                                            continue; // everyone died
                                        }
                                        let recovery = getRecovery(result);
                                        if (recovery.recov > bestBattle.recovery.recov) {
                                            if (recovery.recov > 0 || recovery.remain > bestBattle.recovery.remain) {
                                                bestBattle.recovery = recovery;
                                                bestBattle.selectedTeamNum = teamNum;
                                                bestBattle.attackers = result.battleData.attackers;
                                            }
                                        }
                                        if (count % 1000 == 0) {
                                            console.log("iterated through ", count, " battles in slow mode");
                                        }
                                    }
                                    actions.splice(0, actions.length);
                                    // end early if you find a net-positive combination
                                    if (bestBattle.recovery.recov > 0) {
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        /** Получаем нейтральную команду */
        function getNeutralTeam(id, swapId, addId) {
            let neutralTeam = clone(teams.water);
            let neutral = neutralTeam.heroes;
            if (neutral.length > 2) { // only do preferential adding if we have a water totem active
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
            } else { // clear irrelevant water titans, no need to try to heal Factor with water totem, hyperion is still the first "backup"
                neutral.splice(0, neutral.length);
                // still add the special healer
                if (!!addId) {
                    neutral.push(addId);
                }
            }
            let i = 0;
            while (neutral.length < 5 && i < backups.length) {
                if (!neutral.includes(backups[i])) {
                    neutral.push(backups[i]);
                }
                ++i;
            }
            if (neutral.length < 5) {
                console.log("WARNING: There are not 5 neutral titans alive for this fight");
            }
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
            let bestRecovery = {'recov': -10000, 'remain': -5};
            let actions = [];
            for (let i = 0; i < countBattle; i++) {
                actions.push(startBattle(teamNum, attackerType, team));
            }
            for (let result of await Promise.all(actions)) {
                let recovery = getRecovery(result);
                if (recovery.recov > bestRecovery.recov) {
                    bestRecovery = recovery;
                }
            }
            return bestRecovery;
        }

        function getRemainingHP(result) {
            let beforeTitans = result.battleData.attackers;
            let afterTitans = result.progress[0].attackers.heroes;
            let count = 0;
            let deaths = 0;
            let sumFrac = 0.0;
            for (let i in beforeTitans) {
                ++count;
                if (!(i in afterTitans)) {
                    deaths += 1;
                    continue; // add zero to sumFrac
                }
                let elementId = i.slice(2, 3);
                let isWater = elementId == '0';
                let isOtherElement = (elementId == '1') || (elementId =='2');
                let titan = afterTitans[i];
                let state = titansStates[i];
                let percentHP = titan.hp / beforeTitans[i].hp;
                if (!!state) {
                    percentHP = titan.hp / state.maxHp;
                }
                if (isWater) {
                    percentHP /= 1.5;
                }
                if (isOtherElement) { // treat them as lower than they are for neutral comparisons
                    percentHP /= 2;
                }
                sumFrac += percentHP
            }
            return sumFrac / count - deaths; // we want more deaths to always be bad
        }

        /** Возвращает разницу в здоровье атакующей команды после и до битвы и проверяет здоровье титанов на необходимый минимум*/
        function getRecovery(result) {
            let sumFactor = 0;
            let ret = {'recov': -10000, 'remain': -5}
            if (!result.result || !result.result.win) {
                return ret;
            }
            switch (result.result.stars) {
                case 0:
                    sumFactor -= 10;
                    break;
                case 1:
                    sumFactor -= 7;
                    break;
                case 2:
                    sumFactor -= 4;
                    break;
            }
            let beforeTitans = result.battleData.attackers;
            let afterTitans = result.progress[0].attackers.heroes;
            for (let i in beforeTitans) {
                let elementId = i.slice(2, 3);
                let isTank = (i.slice(3, 4) == '0');
                let isWater = elementId == '0';
                let isOtherElement = (elementId == '1') || (elementId =='2');
                if (!(i in afterTitans)) {
                    // find out which titan died, decrement appropriately
                    switch (elementId) {
                        case '0':
                            sumFactor -= 50; // water titans too important to lose because of totem, more important than an extra non-water titan
                            sumFactor -= 10 * (4 - getTitanTeam('water').length);
                            break;
                        case '1':
                            sumFactor -= 10 * (5 - getTitanTeam('fire').length);
                            break;
                        case '2':
                            sumFactor -= 10 * (5 - getTitanTeam('earth').length);
                            break;
                        default: //just skip light/dark, even tanks
                            continue;
                    }
                    // check if elemental tank died
                    if (isTank) {
                        sumFactor -= 100;
                    }
                    continue;
                }
                let titan = afterTitans[i];
                let state = titansStates[i];
                let percentHP = titan.hp / beforeTitans[i].hp;
                let percentHPChange = percentHP - 1;
                let energyChange = titan.energy;
                if (!!state) {
                    percentHP = titan.hp / state.maxHp;
                    percentHPChange = percentHP - state.hp / state.maxHp;
                    energyChange -= state.energy;
                }
                let newFactor = getFactor(i, energyChange, percentHPChange);
                // non-water elemental tanks mean the most
                if (isTank && isOtherElement) {
                    newFactor *= 10;
                } else if (isOtherElement || isWater) {
                    newFactor *= 5;
                }
/*
                // check final energy value because that determines tank condition
                if (!checkTitan(i, titan.energy, percentHP)) {
                    // important titan has been damaged
                    newFactor -= 7;
                }
*/
                sumFactor += newFactor;
            }
            ret.recov = sumFactor;
            ret.remain = getRemainingHP(result);
            return ret;
        }

        /** titan recovery factor */
        function getFactor(id, energy, percentHPChange) {
            // only factor in energy for the healer titans
            let energyBonus = (id == '4032' || id == '4033' || id == '4042') ? energy / 20000.0 : 0;
            return percentHPChange + energyBonus;
        }

        /** false if important titan was damaged too much */
        function checkTitan(id, energy, percentHP) {
            switch (id) {
                case '4020':
                    return percentHP > 0.4 || (energy == 1000 && percentHP > 0.1);
                case '4010':
                    return percentHP + energy / 2000.0 > 0.63;
                case '4000': // sigurd
                    return percentHP > 0.62 || (energy < 1000 && (
                        (percentHP > 0.45 && energy >= 400) ||
                        (percentHP > 0.3 && energy >= 670)));
                case '4003': // hyperion
                    return percentHP > 0.50;
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
                let heroes = args.heroes;
                send(JSON.stringify(startBattleCall), resultBattle, {
                    resolve,
                    teamNum,
                    attackerType,
                    heroes
                });
            });
        }

        function resultBattle(resultBattles, args) {
            if (!!resultBattles && !!resultBattles.results) {
                let battleData = resultBattles.results[0].result.response;
                let battleType = "get_tower";
                if (battleData.type == "dungeon_titan") {
                    battleType = "get_titan";
                }
                battleData.progress = [{ attackers: { input: ["auto", 0, 0, "auto", 0, 0] } }];
                BattleCalc(battleData, battleType, function (result) {
                    result.teamNum = args.teamNum;
                    result.attackerType = args.attackerType;
                    result.heroes = args.heroes;
                    args.resolve(result);
                });
            }
        }

        /** Заканчиваем бой */

        ////
        async function endBattle(battleInfo) {
            if (!!battleInfo && battleInfo.result.win) {
                const args = {
                    result: battleInfo.result,
                    progress: battleInfo.progress,
                }
                if (battleInfo.result.stars < 3) {
                    console.log('WARNING: A hero or Titan will die in battle!', battleInfo);
                }
                if (countPredictionCard > 0) {
                    args.isRaid = true;
                } else {
                    const timer = getTimer(battleInfo.battleTime);
                    console.log(timer);
                    await countdownTimer(timer, `${I18N('DUNGEON2')}: ${I18N('TITANIT')} ${dungeonActivity}/${maxDungeonActivity} ${talentMsg}`);
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
                if (!!battleResult.reward) {
                    dungeonActivity += battleResult.reward.dungeonActivity ?? 0;
                }
                checkFloor(dungeonGetInfo);
            } else {
                endDungeon('Lost connection with the game server!', 'break');
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
                workTime[i] = Math.round(workTime[i] / 1000);
            }
            countTeam.sort(function(a, b) {
                return b.count - a.count;
            });
            console.log(titansStates);
            console.log("Titanite collected: ", activity);
            console.log("Collection speed: " + Math.round(3600 * activity / workTime.all) + " titanite/hour");
            console.log("Time for excavations: ");
            for (let i in workTime) {
                let timeNow = workTime[i];
                console.log(i + ": ", Math.round(timeNow / 3600) + " hr. " + Math.round(timeNow % 3600 / 60) + " min. " + timeNow % 60 + " sec.");
            }
            console.log("Frequency of command usage: ");
            for (let i in countTeam) {
                let teams = countTeam[i];
                console.log(teams.team + ": ", teams.count);
            }
        }

        function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }

        /** Заканчиваем копать подземелье */
        function endDungeon(reason, info) {
            if (!end) {
                end = true;
                console.log(reason, info);
                showStats();
                if (info == 'break') {
                    setProgress('Dungeon stopped: titanite ' + dungeonActivity + '/' + maxDungeonActivity +
                                "\r\nLost connection with the game server!", false, hideProgress);
                } else {
                    setProgress('Dungeon completed: titanite ' + dungeonActivity + '/' + maxDungeonActivity, false, hideProgress);
                }
                setTimeout(cheats.refreshGame, 1000);
                // we just took a break, start the dungeon again
                if (info == 'break') {
                    delay(2000).then(() => console.log('try again after 2 seconds'));
                    end = false;
                    send(JSON.stringify(callsExecuteDungeon), startDungeon);
                } else { // we ended the dungeon for real, resolve the promise
                    resolve();
                }
            }
        }


    /** OLD DUNGEON CODE STARTS HERE */
        /** Получаем данные по подземелью */
        function startDungeonOLD(e) {
            stopDung = false; // стоп подземка
            let res = e.results;
            let dungeonGetInfo = res[0].result.response;
            if (!dungeonGetInfo) {
                endDungeonOLD('noDungeon', res);
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
            teams.neutral = getTitanTeamOLD('neutral');
            teams.water = {
                favor: {},
                heroes: getTitanTeamOLD('water'),
                teamNum: 0,
            };
            teams.earth = {
                favor: {},
                heroes: getTitanTeamOLD('earth'),
                teamNum: 0,
            };
            teams.fire = {
                favor: {},
                heroes: getTitanTeamOLD('fire'),
                teamNum: 0,
            };

            checkFloorOLD(dungeonGetInfo);
        }

        function getTitanTeamOLD(type) {
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

        /** Находит стихию на этаже */
        function findElementOLD(floor, element) {
            for (let i in floor) {
                if (floor[i].attackerType === element) {
                    return i;
                }
            }
            return undefined;
        }

        /** Проверяем этаж */
        async function checkFloorOLD(dungeonInfo) {
            if (!('floor' in dungeonInfo) || dungeonInfo.floor?.state == 2) {
                saveProgressOLD();
                return;
            }
            checkTalentOLD(dungeonInfo);
            // console.log(dungeonInfo, dungeonActivity);
            setProgress(`${I18N('DUNGEON2')}: ${I18N('TITANIT')} ${dungeonActivity}/${maxDungeonActivity} ${talentMsg}`);
            //setProgress('Dungeon: Титанит ' + dungeonActivity + '/' + maxDungeonActivity);
            if (dungeonActivity >= maxDungeonActivity) {
                endDungeonOLD('Стоп подземка,', 'набрано титанита: ' + dungeonActivity + '/' + maxDungeonActivity);
                return;
            }
            let activity = dungeonActivity - startDungeonActivity;
            titansStates = dungeonInfo.states.titans;
            if (stopDung){
                endDungeonOLD('Стоп подземка,', 'набрано титанита: ' + dungeonActivity + '/' + maxDungeonActivity);
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
                    let teamNum = findElementOLD(floorChoices, element);
                    if (!!teamNum) {
                        if (element == 'earth') {
                            teamNum = await chooseEarthOrFireOLD(floorChoices);
                            if (teamNum < 0) {
                                endDungeonOLD('Невозможно победить без потери Титана!', dungeonInfo);
                                return;
                            }
                        }
                        chooseElementOLD(floorChoices[teamNum].attackerType, teamNum);
                        return;
                    }
                }
            } else {
                chooseElementOLD(floorChoices[0].attackerType, 0);
            }
        }
        //тест черепахи
        async function checkTalentOLD(dungeonInfo) {
            const talent = dungeonInfo.talent;
            if (!talent) {
                return;
            }
            const dungeonFloor = +dungeonInfo.floorNumber;
            const talentFloor = +talent.floorRandValue;
            let doorsAmount = 3 - talent.conditions.doorsAmount;

            if (dungeonFloor === talentFloor && (!doorsAmount || !talent.conditions?.farmedDoors[dungeonFloor])) {
                const reward = await Send({
                    calls: [
                        { name: 'heroTalent_getReward', args: { talentType: 'tmntDungeonTalent', reroll: false }, ident: 'group_0_body' },
                        { name: 'heroTalent_farmReward', args: { talentType: 'tmntDungeonTalent' }, ident: 'group_1_body' },
                    ],
                }).then((e) => e.results[0].result.response);
                const type = Object.keys(reward).pop();
                const itemId = Object.keys(reward[type]).pop();
                const count = reward[type][itemId];
                const itemName = cheats.translate(`LIB_${type.toUpperCase()}_NAME_${itemId}`);
                talentMsgReward += `<br> ${count} ${itemName}`;
                doorsAmount++;
            }
            talentMsg = `<br>TMNT Talent: ${doorsAmount}/3 ${talentMsgReward}<br>`;
        }

        /** Выбираем огнем или землей атаковать */
        async function chooseEarthOrFireOLD(floorChoices) {
            bestBattle.recovery = -11;
            let selectedTeamNum = -1;
            for (let attempt = 0; selectedTeamNum < 0 && attempt < 4; attempt++) {
                for (let teamNum in floorChoices) {
                    let attackerType = floorChoices[teamNum].attackerType;
                    selectedTeamNum = await attemptAttackEarthOrFireOLD(teamNum, attackerType, attempt);
                }
            }
            console.log("Выбор команды огня или земли: ", selectedTeamNum < 0 ? "не сделан" : floorChoices[selectedTeamNum].attackerType);
            return selectedTeamNum;
        }

        /** Попытка атаки землей и огнем */
        async function attemptAttackEarthOrFireOLD(teamNum, attackerType, attempt) {
            let start = new Date();
            let team = clone(teams[attackerType]);
            let startIndex = team.heroes.length + attempt - 4;
            console.log(attempt, teamNum);
            if (startIndex >= 0) {
                team.heroes = team.heroes.slice(startIndex);
                let recovery = await getBestRecoveryOLD(teamNum, attackerType, team, 25);
                console.log(recovery, bestBattle);
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
        async function chooseElementOLD(attackerType, teamNum) {
            let result;
            switch (attackerType) {
                case 'hero':
                case 'water':
                    result = await startBattleOLD(teamNum, attackerType, teams[attackerType]);
                    break;
                case 'earth':
                case 'fire':
                    result = await attackEarthOrFireOLD(teamNum, attackerType);
                    break;
                case 'neutral':
                    result = await attackNeutralOLD(teamNum, attackerType);
            }
            if (!!result && attackerType != 'hero') {
                let recovery = (!!!bestBattle.recovery ? 10 * getRecoveryOLD(result) : bestBattle.recovery) * 100;
                let titans = result.progress[0].attackers.heroes;
                console.log("Проведен бой: " + attackerType +
                            ", recovery = " + (recovery > 0 ? "+" : "") + Math.round(recovery) + "% \r\n", titans);
            }
            endBattleOLD(result);
        }

        /** Атакуем Землей или Огнем */
        async function attackEarthOrFireOLD(teamNum, attackerType) {
            if (!!!bestBattle.recovery) {
                bestBattle.recovery = -11;
                let selectedTeamNum = -1;
                for (let attempt = 0; selectedTeamNum < 0 && attempt < 4; attempt++) {
                    selectedTeamNum = await attemptAttackEarthOrFireOLD(teamNum, attackerType, attempt);
                }
                if (selectedTeamNum < 0) {
                    endDungeonOLD('Невозможно победить без потери Титана!', attackerType);
                    return;
                }
            }
            return findAttackOLD(teamNum, attackerType, bestBattle.team);
        }

        /** Находим подходящий результат для атаки */
        async function findAttackOLD(teamNum, attackerType, team) {
            team.teamNum = teamNum;
            let start = new Date();
            let recovery = -1000;
            let iterations = 0;
            let result;
            let correction = 0.01;
            for (let needRecovery = bestBattle.recovery; recovery < needRecovery; needRecovery -= correction, iterations++) {
                result = await startBattleOLD(teamNum, attackerType, team);
                recovery = getRecoveryOLD(result);
            }
            bestBattle.recovery = recovery;
            let workTime = new Date().getTime() - start.getTime();
            timeDungeon.findAttack += workTime;
            return result;
        }

        /** Атакуем Нейтральной командой */
        async function attackNeutralOLD(teamNum, attackerType) {
            let start = new Date();
            let factors = calcFactor();
            bestBattle.recovery = -0.2;
            await findBestBattleNeutralOLD(teamNum, attackerType, factors, true)
            if (bestBattle.recovery < 0 || (bestBattle.recovery < 0.2 && factors[0].value < 0.5)) {
                let recovery = 100 * bestBattle.recovery;
                console.log("Не удалось найти удачный бой в быстром режиме: " + attackerType +
                            ", recovery = " + (recovery > 0 ? "+" : "") + Math.round(recovery) + "% \r\n", bestBattle.attackers);
                await findBestBattleNeutralOLD(teamNum, attackerType, factors, false)
            }
            let workTime = new Date().getTime() - start.getTime();
            timeDungeon.attackNeutral += workTime;
            if (!!bestBattle.attackers) {
                let team = getTeamOLD(bestBattle.attackers);
                return findAttackOLD(teamNum, attackerType, team);
            }
            endDungeonOLD('Не удалось найти удачный бой!', attackerType);
            return undefined;
        }

        /** Находит лучшую нейтральную команду */
        async function findBestBattleNeutralOLD(teamNum, attackerType, factors, mode) {
            let countFactors = factors.length < 4 ? factors.length : 4;
            let aradgi = !titansStates['4013']?.isDead;
            let edem = !titansStates['4023']?.isDead;
            let dark = [4032, 4033].filter(e => !titansStates[e]?.isDead);
            let light = [4042].filter(e => !titansStates[e]?.isDead);
            let actions = [];
            if (mode) {
                for (let i = 0; i < countFactors; i++) {
                    actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(factors[i].id)));
                }
                if (countFactors > 1) {
                    let firstId = factors[0].id;
                    let secondId = factors[1].id;
                    actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4001, secondId)));
                    actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4002, secondId)));
                    actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4003, secondId)));
                }
                if (aradgi) {
                    actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(4013)));
                    if (countFactors > 0) {
                        let firstId = factors[0].id;
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4000, 4013)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4001, 4013)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4002, 4013)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4003, 4013)));
                    }
                    if (edem) {
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(4023, 4000, 4013)));
                    }
                }
            } else {
                if (mode) {
                    for (let i = 0; i < factors.length; i++) {
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(factors[i].id)));
                    }
                } else {
                    countFactors = factors.length < 2 ? factors.length : 2;
                }
                for (let i = 0; i < countFactors; i++) {
                    let mainId = factors[i].id;
                    if (aradgi && (mode || i > 0)) {
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4000, 4013)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4001, 4013)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4002, 4013)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4003, 4013)));
                    }
                    for (let i = 0; i < dark.length; i++) {
                        let darkId = dark[i];
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4001, darkId)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4002, darkId)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4003, darkId)));
                    }
                    for (let i = 0; i < light.length; i++) {
                        let lightId = light[i];
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4001, lightId)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4002, lightId)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4003, lightId)));
                    }
                    let isFull = mode || i > 0;
                    for (let j = isFull ? i + 1 : 2; j < factors.length; j++) {
                        let extraId = factors[j].id;
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4000, extraId)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4001, extraId)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(mainId, 4002, extraId)));
                    }
                }
                if (aradgi) {
                    if (mode) {
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(4013)));
                    }
                    for (let i = 0; i < dark.length; i++) {
                        let darkId = dark[i];
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(darkId, 4001, 4013)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(darkId, 4002, 4013)));
                    }
                    for (let i = 0; i < light.length; i++) {
                        let lightId = light[i];
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(lightId, 4001, 4013)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(lightId, 4002, 4013)));
                    }
                }
                for (let i = 0; i < dark.length; i++) {
                    let firstId = dark[i];
                    actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId)));
                    for (let j = i + 1; j < dark.length; j++) {
                        let secondId = dark[j];
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4001, secondId)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4002, secondId)));
                    }
                }
                for (let i = 0; i < light.length; i++) {
                    let firstId = light[i];
                    actions.push(startBattle(teamNum, attackerType, getNeutralTeamOLD(firstId)));
                    for (let j = i + 1; j < light.length; j++) {
                        let secondId = light[j];
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4001, secondId)));
                        actions.push(startBattleOLD(teamNum, attackerType, getNeutralTeamOLD(firstId, 4002, secondId)));
                    }
                }
            }
            for (let result of await Promise.all(actions)) {
                let recovery = getRecoveryOLD(result);
                if (recovery > bestBattle.recovery) {
                    bestBattle.recovery = recovery;
                    bestBattle.attackers = result.progress[0].attackers.heroes;
                }
            }
        }

        /** Получаем нейтральную команду */
        function getNeutralTeamOLD(id, swapId, addId) {
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
        function getTeamOLD(titans) {
            return {
                favor: {},
                heroes: Object.keys(titans).map(id => parseInt(id)),
                teamNum: 0,
            };
        }

        /** Вычисляем фактор боеготовности титанов */
        function calcFactorOLD() {
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
        async function getBestRecoveryOLD(teamNum, attackerType, team, countBattle) {
            let bestRecovery = -1000;
            let actions = [];
            for (let i = 0; i < countBattle; i++) {
                actions.push(startBattleOLD(teamNum, attackerType, team));
            }
            for (let result of await Promise.all(actions)) {
                let recovery = getRecoveryOLD(result);
                if (recovery > bestRecovery) {
                    bestRecovery = recovery;
                }
            }
            return bestRecovery;
        }

        /** Возвращает разницу в здоровье атакующей команды после и до битвы и проверяет здоровье титанов на необходимый минимум*/
        function getRecoveryOLD(result) {
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
                let factor = checkTitanOLD(i, energy, percentHP) ? getFactorOLD(i, energy, percentHP) : -100;
                afterSumFactor += factor;
            }
            for (let i in beforeTitans) {
                let titan = beforeTitans[i];
                let state = titan.state;
                beforeSumFactor += !!state ? getFactorOLD(i, state.energy, state.hp / titan.hp) : 1;
            }
            return afterSumFactor - beforeSumFactor;
        }

        /** Возвращает состояние титана*/
        function getFactorOLD(id, energy, percentHP) {
            let elemantId = id.slice(2, 3);
            let isEarthOrFire = elemantId == '1' || elemantId == '2';
            let energyBonus = id == '4020' && energy == 1000 ? 0.1 : energy / 20000.0;
            let factor = percentHP + energyBonus;
            return isEarthOrFire ? factor : factor / 10;
        }

        /** Проверяет состояние титана*/
        function checkTitanOLD(id, energy, percentHP) {
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
        function startBattleOLD(teamNum, attackerType, args) {
            return new Promise(function (resolve, reject) {
                args.teamNum = teamNum;
                let startBattleCall = {
                    calls: [{
                        name: "dungeonStartBattle",
                        args,
                        ident: "body"
                    }]
                }
                send(JSON.stringify(startBattleCall), resultBattleOLD, {
                    resolve,
                    teamNum,
                    attackerType
                });
            });
        }


        function resultBattleOLD(resultBattles, args) {
            let battleData = resultBattles.results[0].result.response;
            let battleType = "get_tower";
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
        async function endBattleOLD(battleInfo) {
            if (!!battleInfo) {
                const args = {
                    result: battleInfo.result,
                    progress: battleInfo.progress,
                }
                if (battleInfo.result.stars < 3) {
                    endDungeonOLD('Герой или Титан мог погибнуть в бою!', battleInfo);
                    return;
                }
                if (countPredictionCard > 0) {
                    args.isRaid = true;
                } else {
                    const timer = getTimer(battleInfo.battleTime);
                    console.log(timer);
                    await countdownTimer(timer, `${I18N('DUNGEON2')}: ${I18N('TITANIT')} ${dungeonActivity}/${maxDungeonActivity} ${talentMsg}`);
                }
                const calls = [{
                    name: "dungeonEndBattle",
                    args,
                    ident: "body"
                }];
                lastDungeonBattleData = null;
                send(JSON.stringify({ calls }), resultEndBattleOLD);
            } else {
                endDungeonOLD('dungeonEndBattle win: false\n', battleInfo);
            }
        }
        /** Получаем и обрабатываем результаты боя */
        function resultEndBattleOLD(e) {
            if (!!e && !!e.results) {
                let battleResult = e.results[0].result.response;
                if ('error' in battleResult) {
                    endDungeonOLD('errorBattleResult', battleResult);
                    return;
                }
                let dungeonGetInfo = battleResult.dungeon ?? battleResult;
                dungeonActivity += battleResult.reward.dungeonActivity ?? 0;
                checkFloorOLD(dungeonGetInfo);
            } else {
                endDungeonOLD('Потеряна связь с сервером игры!', 'break');
            }
        }

        function saveProgressOLD() {
            let saveProgressCall = {
                calls: [{
                    name: "dungeonSaveProgress",
                    args: {},
                    ident: "body"
                }]
            }
            send(JSON.stringify(saveProgressCall), resultEndBattleOLD);
        }


        /** Выводит статистику прохождения подземелья */
        function showStatsOLD() {
            let activity = dungeonActivity - startDungeonActivity;
            let workTime = clone(timeDungeon);
            workTime.all = new Date().getTime() - workTime.all;
            for (let i in workTime) {
                workTime[i] = Math.round(workTime[i] / 1000);
            }
            countTeam.sort(function(a, b) {
                return b.count - a.count;
            });
            console.log(titansStates);
            console.log("Собрано титанита: ", activity);
            console.log("Скорость сбора: " + Math.round(3600 * activity / workTime.all) + " титанита/час");
            console.log("Время раскопок: ");
            for (let i in workTime) {
                let timeNow = workTime[i];
                console.log(i + ": ", Math.round(timeNow / 3600) + " ч. " + Math.round(timeNow % 3600 / 60) + " мин. " + timeNow % 60 + " сек.");
            }
            console.log("Частота использования команд: ");
            for (let i in countTeam) {
                let teams = countTeam[i];
                console.log(teams.team + ": ", teams.count);
            }
        }

        /** Заканчиваем копать подземелье */
        function endDungeonOLD(reason, info) {
            if (!endOLD) {
                endOLD = true;
                console.log(reason, info);
                showStatsOLD();
                if (info == 'break') {
                    setProgress('Dungeon stopped: Титанит ' + dungeonActivity + '/' + maxDungeonActivity +
                                "\r\nПотеряна связь с сервером игры!", false, hideProgress);
                } else {
                    setProgress('Dungeon completed: Титанит ' + dungeonActivity + '/' + maxDungeonActivity, false, hideProgress);
                }
                setTimeout(cheats.refreshGame, 1000);
                // we just took a break, start the dungeon again
                if (info == 'break') {
                    delay(2000).then(() => console.log('try again after 2 seconds'));
                    endOLD = false;
                    send(JSON.stringify(callsExecuteDungeon), startDungeonOLD);
                } else if (stopDung) {
                    end = true;
                    console.log("Dungeon manually stopped, ending in old dungeon");
                    resolve();
                } else { // we cannot continue in the old dungeon, start the new dungeon
                    delay(2000).then(() => console.log('OLD DUNGEON ENDS HERE, STARTING NEW DUNGEON'));
                    end = false;
                    send(JSON.stringify(callsExecuteDungeon), startDungeon);
                }
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
