// ==UserScript==
// @name         Cultivation Helper Rewritten
// @namespace    http://tampermonkey.net/
// @version      3.1415926-beta.12
// @description  Cultivation Helper Rewritten for the game "修仙之路" on the platform "QQ频道" (https://pd.qq.com/) by yoyi-is-charging
// @author       yoyi-is-charging
// @license      MIT
// @match        https://pd.qq.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529445/Cultivation%20Helper%20Rewritten.user.js
// @updateURL https://update.greasyfork.org/scripts/529445/Cultivation%20Helper%20Rewritten.meta.js
// ==/UserScript==

/**
 * @typedef {({text: {str: string; bytes_pb_reserve: string|null;};})[]} Command
 */

class Utils {
    /**
     * Parses a time string to a date object.
     * @param {number} hour - The hour.
     * @param {number} minute - The minute.
     * @param {number} second - The second.
     * @returns {Date} The date object.
     * @static
     */
    static timeToDate(hour, minute, second) {
        const now = new Date();
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);
        if (date < now)
            date.setDate(date.getDate() + 1);
        return date;
    };
    /**
     * Converts a utf8 string to base64.
     * @param {string} utf8 - The utf8 string.
     * @returns {string} The base64 string.
     * @static
     */
    static UTF8Tobase64 = (utf8) => btoa(new TextEncoder().encode(utf8).reduce((acc, c) => acc + String.fromCharCode(c), ''));
    /**
     * Converts a base64 string to utf8.
     * @param {string} base64 - The base64 string.
     * @returns {string} The utf8 string.
     * @static
     */
    static base64ToUTF8 = (base64) => new TextDecoder().decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0)));
    /**
     * Gets the type of a command.
     * @param {Command} command - The command.
     * @returns {string} The type of the command.
     * @static
     */
    static getType = (command) => command[0].text.str.split(' ')[0];
    /**
     * Gets the category of a command.
     * @param {Command} command - The command to send.
     * @returns {string} - The category of the command.
     * @static
     */
    static getCategory = (command) => gameState.metadata.commands[Utils.getType(command)].category;

    /**
     * Gets the expected response pattern for a command.
     * @param {Command} command - The command to send.
     * @returns {RegExp} - The expected response pattern.
     * @static
     */
    static getPattern = (command) => gameState.metadata.commands[Utils.getType(command)].pattern;

    static getFightCommand = () => [{ text: { str: `试剑`, bytes_pb_reserve: null } }, { text: gameState.metadata.fightTarget }];
}

class GameState {
    constructor() {
        this.dailyTasks = {
            killCount: 0,
            challengeCount: 0,
            forgeCount: 0,
            towerCount: 0,
            worshipCount: 0,
            fightCount: 0,
            schoolFightCount: 0,
            sectChallengeCount: 0,
            sectFightCount: 0,
            sectTaskState: null,
        };
        this.metadata = {
            commands: {
                '打坐': { category: 'meditation', pattern: /请等待打坐完成|需要消耗次数/ },
                '吸收灵力': { category: 'meditation', pattern: /请等待(打坐|双修|双休)完成|吸收灵力成功|你还没有打坐/ },
                '药园': { category: 'garden', pattern: /目前药园种植情况/ },
                '一键种植': { category: 'garden', pattern: /一键种植成功|请先购买种子/ },
                '收获': { category: 'garden', pattern: /区域1|分钟后可来收获/ },
                '查看宗门悬赏': { category: 'bounty', pattern: /已领任务/ },
                '领宗门悬赏': { category: 'bounty_claim', pattern: /领宗门悬赏成功/ },
                '接宗门悬赏': { category: 'bounty_accept', pattern: /正在进行中的悬赏|接收悬赏成功/ },
                '大混战报名': { category: 'scrimmage', pattern: /预计开打时间|当小时内已报名|当前小时的报名已截止|今日已经报名/ },
                '进入秘境': { category: 'secretRealm', pattern: /注意选择合适的技能|仅可进入秘境1次/ },
                '秘境选择': { category: 'secretRealm', pattern: /可以选择以下技能|今日本层秘境魔物已全部清除|秘境选择已过期/ },
                '进入妖兽园': { category: 'zoo', pattern: /剩余妖兽|仅可进入妖兽园1次/ },
                '横扫': { category: 'zoo', pattern: /剩余妖兽|妖兽已过期|被消灭了/ },
                '力劈': { category: 'zoo', pattern: /剩余妖兽|妖兽已过期|被消灭了/ },
                '进入幻境': { category: 'dreamland', pattern: /已进入幻境|进入幻境已达上限|随周末活动一起开启/ },
                '击杀幻兽': { category: 'dreamland', pattern: /已击杀幻兽|已击杀全部幻兽/ },
                '出幻境': { category: 'dreamland', pattern: /找到了生门/ },
                '进入鱼塘': { category: 'fishing', pattern: /今日已进过鱼塘了|已离开鱼塘|无法进入鱼塘|23点00分00秒|已进入鱼塘/ },
                '重新进入鱼塘': { category: 'fishing', pattern: /已经重新进入|已离开鱼塘|无法进入鱼塘|23点00分00秒|已进入鱼塘/ },
                '进入林场': { category: 'wooding', pattern: /已进入林场|已离开林场|无法进入林场|23点00分00秒/ },
                '浇水': { category: 'wooding', pattern: /预计缺水时间|停止增长/ },
                '砍伐树木': { category: 'wooding', pattern: /砍伐完成/ },
                '我的树木': { category: 'wooding_priceInquiry', pattern: /我的木块|还没种过树/ },
                '出售给木商': { category: 'wooding_sell', pattern: /确定要出售/ },
                '确定出售给木商': { category: 'wooding_sell', pattern: /出售完成/ },
                '甩杆': { category: 'fishing', pattern: /预计[上咬]钩时间|鱼情好/ },
                '拉杆': { category: 'fishing', pattern: /太早了|鱼情好|离开鱼塘/ },
                '离开鱼塘': { category: 'fishing', pattern: /已离开鱼塘/ },
                '地狱寻宝': { category: 'hell', pattern: /(\d+)层已寻完|你今日已领过寻宝符石了|地狱寻宝/ },
                '宗门签到': { category: 'dailyTasks_sectSign', pattern: /宗门签到成功|今日已宗门签到/ },
                '签到': { category: 'dailyTasks_sign', pattern: /签到成功|今日已签到/ },
                '送能量': { category: 'dailyTasks_sendEnergy', pattern: /送能量成功|已送过能量/ },
                '领每日能量': { category: 'dailyTasks_abode', pattern: /领取每日能量成功|已领过能量/ },
                '全部转动': { category: 'dailyTasks_abode', pattern: /我的洞府|能量不足/ },
                '传功': { category: 'dailyTasks_transferEnergy', pattern: /传功成功|已经传功|无法传功/ },
                '砍一刀': { category: 'dailyTasks_kill', pattern: /挑战一刀斩|体力不足/ },
                '挑战噬魂兽': { category: 'dailyTasks_challenge', pattern: /剩余挑战次数|每人每天挑战噬魂兽3次/ },
                '锻造': { category: 'dailyTasks_forge', pattern: /锻造(成功|失败)|炼器上限/ },
                '塔攻击': { category: 'dailyTasks_tower', pattern: /挑战通天塔/ },
                '膜拜排位': { category: 'dailyTasks_worship', pattern: /崇拜的目光|已膜拜|膜拜排位10次/ },
                '随机试剑': { category: 'dailyTasks_fight', pattern: /试剑(成功|失败|过了)|最多试剑25次|1小时内只能试剑1次/ },
                '师门切磋': { category: 'dailyTasks_fight', pattern: /师门切磋|切磋过了|暂无其它弟子|没找到你要切磋的序号/ },
                '宗门挑战': { category: 'dailyTasks_fight', pattern: /宗门挑战|最多挑战10次/ },
                '宗门切磋': { category: 'dailyTasks_fight', pattern: /宗门切磋|切磋过了|没找到你要切磋的序号|今日切磋次数已用完/ },
                '试剑': { category: 'dailyTasks_fightTarget', pattern: /试剑(成功|失败|过了)|最多试剑25次|1小时内只能试剑1次/ },
                '开始宗门任务': { category: 'dailyTasks_sectTask', pattern: /任务选择|每人每日任务次数/ },
                '任务选择': { category: 'dailyTasks_sectTask', pattern: /任务选择|今日任务已全部完成|任务选择已过期/ },
            },
            handlers: {
                meditation: { response: this.meditationHandler, error: (_) => commandManager.scheduleCommand(`吸收灵力`) },
                garden: { response: this.gardenHandler, error: (_) => commandManager.scheduleCommand(`药园`) },
                bounty: { response: this.bountyHandler, error: (_) => commandManager.scheduleCommand(`查看宗门悬赏`) },
                scrimmage: { response: this.scrimmageHandler },
                secretRealm: { response: this.secretRealmHandler },
                zoo: { response: this.zooHandler },
                dreamland: { response: this.dreamlandHandler },
                fishing: { response: this.fishingHandler, error: (command) => commandManager.scheduleCommand(['拉杆', '甩杆'].includes(Utils.getType(command)) ? '甩杆' : command) },
                wooding: { response: this.woodingHandler },
                hell: { response: this.hellHandler },
                dailyTasks: { response: this.dailyTasksHandler },
            },
            meditationType: undefined,
            seedType: undefined,
            bountyType: undefined,
            forgeType: undefined,
            forgeCount: undefined,
            hellLevel: undefined,
            hellData: undefined,
            doSectTask: false,
            woodPrice: undefined,
            fightTarget: undefined,
            taskData: {
                '厨房帮工': { '洗菜': /炒出来/, '切菜': /还没切|吃丝|好的帮厨/, '倒垃圾': /垃圾|苍蝇|你懒/, '洗碗': /上次的碗|吃饱|不干不净/ },
                '指点新人': { '妖兽园打法攻略': /兽核/, '秘境打法攻略': /葫芦|提升(功法|装备)/, '通天塔打法攻略': /金丹/, '双休攻略': /道缘/, '宗门新手引导': /玩转宗门/ },
                '跑腿打杂': { '砍柴': /柴火/, '挑水': /水缸/, '挑大粪': /肥料/, '搬搬抬抬': /卸车/ },
                '下山历练': { '新手村A': /\n1\n/, '新手村B': /\n2\n/, '新手村C': /\n3\n/ },
                '组织活动': { '修炼交流会': /修炼进度缓慢/, '下山历练': /历练历练/, '资源采集': /炼丹储存资源/ },
                '灵植萃取': { '指尖从上往下': /上细下粗/, '指尖从下往下': /上粗下细/, '手握从上往下': /上下一致/ },
                '打理药园': { '除草': /杂草|毒草|野草/, '除虫': /虫害|害虫/, '浇水': /赤地|枯萎|干裂/ },
                '整理经卷': { '功法区': /掌法|拳法|御剑术|元功|魔功|长生诀/, '药园区': /灵植术/, '炼丹区': /炼丹秘术/, '炼器区': /炼器秘术/ },
                '编写经卷': { '功法类': /掌法|拳法|御剑术|元功|魔功|长生诀/, '药园类': /灵植术/, '炼丹类': /炼丹秘术/, '炼器类': /炼器秘术/ },
                '装备锻造': { '寒铁': /2级/, '寒铁、精铁': /10级/, '寒铁、精铁、元神': /1001级/ },
                '资源分配': { '炼器师': /寒铁|精铁/, '炼丹师': /灵树|灵植/ },
                '宗门授课1': { '打更高级的地图': /更高阶/, '回合过多最好加攻击': /选择加攻击/, '只要打你还掉血': /选择加防御/, '预计血量不足以支持2个回合': /选择加血量/, '不免伤就挂了': /选择加免伤/, '妖兽阵型是一排的时候': /选择横扫/, '妖兽阵型是一列的时候': /选择力劈/, '看妖兽对你造成的伤害和自己的血量': /选择逃跑/ },
                '宗门授课3': { '做宗门任务': /宗石/, '做宗门任务、宗门挑战': /增加贡献/, '可去藏宝阁兑换资源': /宗门宗石有什么用/, '领宗门灵丹福利的': /赐福/, '可获得功法点': /切磋/, '提升宗门等吉、提升个人职位': /宗门贡献有什么用/ },
                '弟子考核': { '内门弟子': /溜灵兽|研习法宝/, '外门弟子': /整理经卷|看守药园|喂养灵兽/ },
                '任务分配': { '内门弟子': /研习法宝|打理药园|整理经卷/, '外门弟子': /跑腿打杂|擦拭法宝|厨房帮工/ },
                '研习法宝': { '攻击法宝': /没能破甲/, '防御法宝': /被破甲/, '血量法宝': /没血/ },
                '法宝注灵': { '攻击法宝': /攻击5000[万W]/, '防御法宝': /防御1000[万W]/, '血量法宝': /血量1000[万W]/ },
                '钻研功法': { '主要提升攻击': /攻击5000[万W]/, '主要提升防御': /防御1000[万W]/, '主要提升血量': /血量1000[万W]/ },
                '宗门决策': { '支持': /增加贡献的获取方式|开通|增加赐福的灵丹数量\n/, '反对': /不拿宗石|宗石获得|减少赐福的灵丹数量\n/, '中立': /增加\S+减少|减少\S+增加/ },
                '喂养灵兽': { '东方位': /青龙兽/, '南方位': /朱雀兽/, '西方位': /白虎兽/, '北方位': /玄武兽/ },
                '遛灵兽': { '青龙兽': /东方位/, '朱雀兽': /南方位/, '白虎兽': /西方位/, '玄武兽': /北方位/ },
                '打扫大殿': { '左偏殿': /\n左偏殿/, '右偏殿': /\n右偏殿/, '正中殿': /\n正中殿/ },
                '擦拭法宝': { '龙鳞': /神龙|青龙/, '紫瑶石': /紫气|紫霄/, '金丝绢': /金罡|金箍|金灵/, '风之精华': /清风|风云/, '黄稻草': /地藏|地府/, '火焰之力': /燃木|火之心/, '月光水晶': /月影|妖月/, '闪电之力': /雷霆|火雷/ },
                '修炼阵法': { '呀': /选1/, '呀呀': /选2/, '呀呀呀': /选3/, '呀呀呀呀': /选4/, '呀呀呀呀呀': /选5/ },
                '攻打魔族': { '吼': /选1/, '吼吼': /选2/, '吼吼吼': /选3/, '吼吼吼吼': /选4/, '吼吼吼吼吼': /选5/ },
                '宗门外交': { '啊': /选1/, '啊啊': /选2/, '啊啊啊': /选3/, '啊啊啊啊': /选4/, '啊啊啊啊啊': /选5/ },
                '物色人才': { '广招修仙者加入宗门': /第1步/, '查看宗门修炼记录': /第2步/, '举办宗门试剑大会': /第3步/, '准优胜者进入藏经阁': /第4步/, '传授高级神通': /第5步/ },
                '炼制法宝': { '获得法宝图纸': /第1步/, '找到法宝材料': /第2步/, '学习炼制方法': /第3步/, '编写使用方法': /第4步/, '编写注灵方法': /第5步/ },
                '加强结界': { '东方位': /青龙怒/, '南方位': /朱雀怒/, '西方位': /白虎怒/, '北方位': /玄武怒/ },
                '修炼神通': { '金系神通': /肺/, '木系神通': /肝/, '水系神通': /肾/, '火系神通': /心/, '土系神通': /脾/ },
            }
        }
        this.retryCount = {};
    };
    /**
     * Processes a reponse from meditation.
     * @param {Command} command - The command to send.
     * @param {string} response - The response from the server.
     * @returns {void}
     */
    meditationHandler(command, response) {
        const type = Utils.getType(command);
        const matchTime = response.match(/(\d+)时(\d+)分(\d+)秒/);
        const endTime = matchTime ? Utils.timeToDate(...matchTime.slice(1).map(Number)) : null;
        if (![1, 10, 20, 30, 40, 50, undefined].includes(gameState.metadata.meditationType)) {
            console.log(`Invalid meditation type ${gameState.metadata.meditationType}, reset to undefined.`);
            gameState.metadata.meditationType = undefined;
        }
        if (response.match(/需要消耗次数/))
            gameState.metadata.meditationType = undefined;
        if (matchTime)
            commandManager.scheduleCommand(`吸收灵力`, endTime - new Date());
        else if (type === '吸收灵力' && gameState.metadata.meditationType)
            commandManager.scheduleCommand(`打坐 ${gameState.metadata.meditationType}`);
    };
    /**
     * Processes a reponse from the garden.
     * @param {Command} command - The command to send.
     * @param {string} response - The response from the server.
     * @returns {void}
     */
    gardenHandler(command, response) {
        const type = Utils.getType(command);
        const now = new Date();
        let harvestTime = null;
        if (type === '药园') {
            const match = response.match(/(\d+)分钟成熟/);
            harvestTime = match ? new Date(now.getTime() + parseInt(match[1]) * 60000) : (response.match(/已成熟/) ? now : null);
        }
        if (type === '一键种植') {
            const match = response.match(/预计成熟.*?(\d+):(\d+):(\d+)/);
            if (match)
                harvestTime = Utils.timeToDate(...match.slice(1).map(Number));
            if (response.match(/请先购买种子/))
                gameState.metadata.seedType = null;
        }
        if (type === '收获')
            harvestTime = response.match(/区域1/) ? null : new Date(now.getTime() + parseInt(response.match(/(\d+)分钟后可来收获/)[1]) * 60000);
        if (harvestTime === null && gameState.metadata.seedType)
            commandManager.scheduleCommand(`一键种植 ${gameState.metadata.seedType}`);
        if (harvestTime)
            commandManager.scheduleCommand('收获', harvestTime - now + 1000);
    };
    /**
     * Processes a reponse from the bounty.
     * @param {Command} command - The command to send.
     * @param {string} response - The response from the server.
     * @returns {void}
     */
    bountyHandler(command, response) {
        const type = Utils.getType(command);
        const now = new Date();
        let match = null;
        if (type === '查看宗门悬赏') {
            const [, current, total] = response.match(/(\d+)\/(\d+)/);
            const completed = current === total;
            const isFull = response.match(/3:[\s\S]*?待接任务/);
            const index = parseInt(response.match(new RegExp(`(\\d):(${gameState.metadata.bountyType}).*\\n\\n.*需要时间`))?.[1]) || null;
            let refreshTime = Utils.timeToDate(...response.match(/下次自动刷新时间:.*?(\d+):(\d+):(\d+)/).slice(1).map(Number));
            if (completed || refreshTime.getDate() !== now.getDate())
                refreshTime = Utils.timeToDate(0, 0, 0);
            commandManager.scheduleCommand('查看宗门悬赏', refreshTime - now);
            if (response.match(/待领奖励/))
                commandManager.scheduleCommand('领宗门悬赏');
            else if (match = response.match(/剩余(\d+)分钟/))
                commandManager.scheduleCommand('领宗门悬赏', parseInt(match[1]) * 60000);
            if (index && !isFull && !completed)
                commandManager.scheduleCommand(`接宗门悬赏 ${index}`);
        } else
            commandManager.scheduleCommand('查看宗门悬赏');
    }
    /**
     * Processes a reponse from the scrimmage.
     * @param {Command} _command - The command to send.
     * @param {string} response - The response from the server.
     * @returns {void}
     */
    scrimmageHandler(_command, response) {
        const now = new Date();
        const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
        commandManager.scheduleCommand('大混战报名', (response.match(/今日已经报名/) ? Utils.timeToDate(0, 0, 0) : nextHour) - now);
    }
    /**
     * Processes a reponse from the secret realm.
     * @param {Command} _command - The command to send.
     * @param {string} response  - The response from the server.
     * @returns {void}
     */
    secretRealmHandler(_command, response) {
        if (response.match(/魔物境界/))
            commandManager.scheduleCommand(`秘境选择 ${response.match(/(\d+):.*防御/)?.[1] ?? response.match(/(\d+):.*血量/)?.[1] ?? response.match(/(\d+):.*攻击/)?.[1] ?? 1}`, 1000);

    }
    /**
     * Processes a reponse from the zoo.
     * @param {Command} _command - The command to send.
     * @param {string} response - The response from the server.
     * @returns {void}
     */
    zooHandler(_command, response) {
        if (response.match(/剩余妖兽/))
            commandManager.scheduleCommand(response.match(/\([0-9]+\).*\([0-9]+\)/) ? '横扫' : '力劈', 1000);
    }
    /**
     * Processes a reponse from the dreamland.
     * @param {Command} _command - The command to send.
     * @param {string} response - The response from the server.
     * @returns {void}
     */
    dreamlandHandler(_command, response) {
        if (response.match(/尽快击败5头幻兽/)) {
            const level = parseInt(response.match(/境界.*LV(\d+)/)[1]);
            const attackIndex = [1, 2, 3, 4, 5].find(i => parseInt(response.match(new RegExp(`幻兽${i}.*LV(\\d+)`))?.[1]) < level);
            commandManager.scheduleCommand(`击杀幻兽 ${attackIndex}`);
        }
        if (response.match(/八宝罗盘响动/)) {
            const doorIndex = response.match(/门(\d):八宝罗盘响动/)[1];
            commandManager.scheduleCommand(`出幻境 ${doorIndex}`);
        }
    }
    /**
     * Processes a reponse from fishing.
     * @param {Command} _command - The command to send.
     * @param {string} response - The response from the server.
     * @returns {void}
     */
    fishingHandler(_command, response) {
        let match = null;
        if (match = response.match(/位置(\d):鱼情好/))
            commandManager.scheduleCommand(`甩杆 ${match[1]}`);
        else if (match = response.match(/预计[上咬]钩时间:(\d+)时(\d+)分(\d+)秒/))
            commandManager.scheduleCommand(`拉杆`, Utils.timeToDate(...match.slice(1).map(Number)) - new Date() + 1000);
        else if (response.match(/发送指令:离开鱼塘/))
            commandManager.scheduleCommand(`离开鱼塘`);
    }
    /**
     * Processes a reponse from wooding.
     * @param {Command} _command - The command to send.
     * @param {string} response - The response from the server.
     * @returns {void}
     */
    woodingHandler(_command, response) {
        const now = new Date();
        let match = null;
        if (response.match(/已进入林场/))
            commandManager.scheduleCommand(`浇水`);
        else if (match = response.match(/预计缺水时间:(\d+)时(\d+)分(\d+)秒/))
            commandManager.scheduleCommand(`浇水`, Utils.timeToDate(...match.slice(1).map(Number)) - now + 1000);
        else if (response.match(/停止增长/))
            commandManager.scheduleCommand(`砍伐树木`);
        if (response.match(/我的木块/)) {
            const price = parseInt(response.match(/门前木商报架:(\d+)/)[1]);
            if (gameState.metadata.woodPrice && price >= gameState.metadata.woodPrice) {
                const woodCount = parseInt(response.match(/我的木块:(\d+)/)[1]);
                if (woodCount >= 100)
                    commandManager.scheduleCommand(`出售给木商 ${woodCount}`);
                if (commandManager.metadata.notificationEnabled)
                    GM.notification({ text: `木商价格: ${price}`, title: 'Cultivation Helper Rewritten', timeout: 5000, highlight: true });
            }
            commandManager.scheduleCommand(`我的树木`, parseInt(response.match(/(\d+)分后更新/)[1]) * 60000);
        }
        if (response.match(/确定要出售/))
            commandManager.scheduleCommand(`确定出售给木商`);
    }
    /**
     * Processes a reponse from hell.
     * @param {Command} _command - The command to send.
     * @param {string} response - The response from the server.
     * @returns {void} 
     */
    hellHandler(_command, response) {
        if (response.match(/你今日已领过寻宝符石了/))
            return;
        const level = parseInt(response.match(/第(\d+)层/)?.[1] ?? 0) + 1;
        if (level > 20)
            return;
        const data = gameState.metadata.hellData?.data[level] ?? { bz: ['5-5', '5-4', '5-3'], boss: response.match(/BOSS的位置:(\d-\d)/)[1] };
        if (data.bz.includes(data.boss))
            data.bz = data.bz.filter(b => b !== data.boss).concat('5-2');
        let positions = data.bz;
        if (level <= gameState.metadata.hellLevel)
            positions[2] = data.boss;
        commandManager.scheduleCommand(`地狱寻宝 ${positions.join(' ')}`, 1000);
    }
    /**
     * Processes the daily tasks.
     * @param {Command} command - The command to send.
     * @param {string} response - The response from the server.
     * @returns {void}
     */
    dailyTasksHandler(command, response) {
        const type = Utils.getType(command);
        if (type === '领每日能量')
            commandManager.scheduleCommand('全部转动');
        if (type === '砍一刀') {
            gameState.dailyTasks.killCount = response.match(/体力不足/) ? 10 : gameState.dailyTasks.killCount + 1;
            if (gameState.dailyTasks.killCount < 10)
                commandManager.scheduleCommand('砍一刀');
        }
        if (type === '挑战噬魂兽') {
            gameState.dailyTasks.challengeCount = response.match(/每人每天挑战噬魂兽3次/) ? 3 : gameState.dailyTasks.challengeCount + 1;
            if (gameState.dailyTasks.challengeCount < 3)
                commandManager.scheduleCommand('挑战噬魂兽', 1000);
        }
        if (type === '锻造') {
            if (response.match(/炼器上限/))
                return;
            gameState.dailyTasks.forgeCount = parseInt(response.match(/次数(\d+)/)[1]);
            if (gameState.dailyTasks.forgeCount < gameState.metadata.forgeCount)
                commandManager.scheduleCommand(`锻造 ${gameState.metadata.forgeType}`, 1000);
        }
        if (type === '塔攻击') {
            gameState.dailyTasks.towerCount = ((r, t) => t - r)(...response.match(/(\d+)\/(\d+)/).slice(1).map(Number));
            if (gameState.dailyTasks.towerCount < 5)
                commandManager.scheduleCommand('塔攻击', 1000);
        }
        if (type === '膜拜排位') {
            gameState.dailyTasks.worshipCount = response.match(/膜拜排位10次/) ? 10 : gameState.dailyTasks.worshipCount + 1;
            if (gameState.dailyTasks.worshipCount < 10)
                commandManager.scheduleCommand(`膜拜排位 ${gameState.dailyTasks.worshipCount + 1}`, 1000);
        }
        if (type === '试剑') {
            const now = new Date();
            if (response.match(/最多试剑25次/) && now.getHours() < 23)
                commandManager.scheduleCommand(Utils.getFightCommand(), Utils.timeToDate(0, 0, 0) - now);
            else
                commandManager.scheduleCommand(Utils.getFightCommand(), 60 * 60 * 1000);
        }
        if (type === '随机试剑') {
            gameState.dailyTasks.fightCount = response.match(/最多试剑25次/) ? 25 : gameState.dailyTasks.fightCount + 1;
            if (gameState.dailyTasks.fightCount < 10)
                commandManager.scheduleCommand(`随机试剑 ${gameState.dailyTasks.fightCount + 1}`, 1000);
            else
                commandManager.scheduleCommand(`师门切磋 1`, 1000);
        }
        if (type === '师门切磋') {
            gameState.dailyTasks.schoolFightCount = response.match(/暂无其它弟子|没找到你要切磋的序号|师门切磋次数已用完/) ? 10 : gameState.dailyTasks.schoolFightCount + 1;
            if (gameState.dailyTasks.schoolFightCount < 10)
                commandManager.scheduleCommand(`师门切磋 ${gameState.dailyTasks.schoolFightCount + 1}`, 1000);
            else
                commandManager.scheduleCommand(`宗门挑战 1`, 1000);
        }
        if (type === '宗门挑战') {
            gameState.dailyTasks.sectChallengeCount = response.match(/最多挑战10次/) ? 10 : gameState.dailyTasks.sectChallengeCount + 1;
            if (gameState.dailyTasks.sectChallengeCount < 10)
                commandManager.scheduleCommand(`宗门挑战 ${gameState.dailyTasks.sectChallengeCount + 1}`, 1000);
            else
                commandManager.scheduleCommand(`宗门切磋 1`, 1000);
        }
        if (type === '宗门切磋') {
            gameState.dailyTasks.sectFightCount = response.match(/今日切磋次数已用完|没找到你要切磋的序号/) ? 10 : gameState.dailyTasks.sectFightCount + 1;
            if (gameState.dailyTasks.sectFightCount < 10)
                commandManager.scheduleCommand(`宗门切磋 ${gameState.dailyTasks.sectFightCount + 1}`, 1000);
        }
        if (type === '开始宗门任务' || type === '任务选择') {
            gameState.dailyTasks.sectTaskState = response.match(/任务选择/) ? 'inProgress' : 'completed';
            if (gameState.dailyTasks.sectTaskState === 'completed')
                return;
            try {
                const taskType = response.match(/【(.*?)】/)[1];
                const taskData = gameState.metadata.taskData[taskType];
                if (taskData === undefined)
                    throw new Error(`No task data found for task type: ${taskType}`);
                let index = null;
                for (const [key, value] of Object.entries(taskData))
                    if (response.match(value))
                        index = response.match(new RegExp(`(\\d):${key}\\n`))[1];
                if (index)
                    commandManager.scheduleCommand(`任务选择 ${index}`, 1000);
                else
                    throw new Error(`Failed to find an answer for task type: ${taskType}`);
            } catch (error) {
                console.error(`Error processing task response: ${error} - ${response}`);
            }
        }
    }
}

/**
 * Processes a command and routes the response to the appropriate handler.
 * @param {Command} command - The command to send.
 */
async function processCommand(command) {
    const category = Utils.getCategory(command);
    delete commandManager.scheduledCommands[category];
    const key = category.replace(/(_\w+)/, '');
    const commandText = command.map(c => c.text.str).join(' ');
    const timeoutMs = ((gameState.retryCount[commandText] ?? 0) + 1) * 10000;
    commandManager.sendCommand(command, timeoutMs).then(response => {
        try {
            gameState.metadata.handlers[key].response(command, response);
            delete gameState.retryCount[commandText];
        } catch (error) {
            console.error(`Error processing response: ${error}`);
        }
    }).catch(_error => {
        if (!gameState.retryCount[commandText])
            gameState.retryCount[commandText] = 0;
        ++gameState.retryCount[commandText];
        if (gameState.retryCount[commandText] > 5)
            console.error(`Retry limit reached for command: ${commandText}`);
        else {
            console.log(`Handling error for command: ${commandText} [attempt ${gameState.retryCount[commandText]}]`);
            const errorHandler = gameState.metadata.handlers[key].error;
            errorHandler ? errorHandler(command) : commandManager.scheduleCommand(command);
        }
    });
}

class CommandManager {
    constructor() {
        // List of commands waiting for a matching response.
        // Each entry is an object: {command, expectedPattern, resolve, reject, timeoutId}
        this.pendingCommands = [];
        this.scheduledCommands = {};
        this.metadata = {
            botName: undefined,
            notificationEnabled: true,
        };
    }

    /**
     * Sends a command and return a promise that resolves when a matching response is received.
     * @param {Command} command - The command to send.
     * @param {number} timeoutMs - The timeout in milliseconds.
     */
    sendCommand(command, timeoutMs) {
        let body = JSON.parse(responseParser.sendParams.init.body);
        const commandText = command.map(c => c.text.str).join(' ');
        body.msg.head.content_head.random = Date.now();
        body.msg.body.rich_text.elems = [{ text: { str: responseParser.UTF8Tobase64(commandManager.metadata.botName), bytes_pb_reserve: "GAIovIWNpPKAgIAC" } }]
            .concat(command.map(c => ({ text: { str: responseParser.UTF8Tobase64(` ${c.text.str}`), bytes_pb_reserve: c.text.bytes_pb_reserve } })));
        responseParser.sendParams.init.body = JSON.stringify(body);
        fetch(responseParser.sendParams.input, responseParser.sendParams.init).then(res => res.json()).then(_data => {
            console.log(`Sent command: ${commandText}`);
        }
        ).catch(_error => {
            console.error(`Failed to send command: ${commandText}`);
            delete gameState.retryCount[command];
        });
        // Get the expected response pattern.
        const expectedPattern = Utils.getPattern(command);
        if (!expectedPattern)
            return Promise.reject(`No response pattern defined for command: ${commandText}`);
        return new Promise((resolve, reject) => {
            // Add the command to the list of pending commands.
            const timeoutId = setTimeout(() => {
                // Remove the command from the list of pending commands.
                commandManager.pendingCommands = commandManager.pendingCommands.filter(c => c.command !== command);
                reject(`Command timed out: ${commandText}`);
            }, timeoutMs);
            commandManager.pendingCommands.push({ command, expectedPattern, resolve, reject, timeoutId });
            responseParser.scheduleUpdate();
        }, timeoutMs);
    }

    /**
     * Schedules a command to be executed at a later time.
     * @param {Command} command - The command to send.
     * @param {number} timeoutMs - The timeout in milliseconds.
     * @returns {void}
     */
    scheduleCommand(command, timeoutMs = 0) {
        if (typeof command === 'string')
            command = [{ text: { str: command, bytes_pb_reserve: null } }];
        const category = Utils.getCategory(command);
        const date = new Date(Date.now() + timeoutMs);
        if (commandManager.scheduledCommands[category])
            clearTimeout(commandManager.scheduledCommands[category].timeoutId);
        commandManager.scheduledCommands[category] = { command, date, timeoutId: setTimeout(() => processCommand(command), timeoutMs) };
        responseParser.scheduleUpdate();
    }

    /**
     * Processes a reponse from the incoming stream.
     * This method should be called whenever a new response arrives.
     * @param {string} response
     * @returns {void}
     */
    processResponse(response) {
        const pendingCommand = commandManager.pendingCommands.find(c => response.match(c.expectedPattern));
        if (!pendingCommand)
            return;
        clearTimeout(pendingCommand.timeoutId);
        pendingCommand.resolve(response);
        commandManager.pendingCommands = commandManager.pendingCommands.filter(c => c !== pendingCommand);
    }
}

class ResponseParser {
    constructor() {
        this.latestResponseIndex = 0;
        this.updated = false;
        this.receiveParams = null;
        this.sendParams = null;
        this.tinyID = undefined;
        this.lastFetchTime = null;
        this.schedule = null;
    }
    scheduleUpdate() {
        let interval = (this.updated && commandManager.pendingCommands.length === 0) ? 15000 : 1000;
        const timeInAdvance = 5 * 60 * 1000;
        if (this.schedule)
            clearTimeout(this.schedule.timeoutId);
        if (commandManager.pendingCommands.length > 0)
            this.schedule = { date: new Date(Date.now() + interval), timeoutId: setTimeout(() => this.update(), interval) };
        else if (Object.keys(commandManager.scheduledCommands).length > 0) {
            const nextCommand = Object.values(commandManager.scheduledCommands).reduce((a, b) => a.date < b.date ? a : b);
            const nextDate = new Date(Math.max(nextCommand.date - timeInAdvance, Date.now() + interval));
            this.schedule = { date: nextDate, timeoutId: setTimeout(() => this.update(), nextDate - Date.now()) };
        } else
            this.schedule = null;
    }
    update() {
        if (this.receiveParams === null || this.sendParams === null) {
            console.error('Missing receiveParams or sendParams');
        }
        this.schedule = null;
        this.lastFetchTime = new Date();
        fetch(this.receiveParams.input, this.receiveParams.init).then(response => response.json()).then(data => {
            if (data.data.channel_msg_rsp === null)
                return this.updated = true;
            let msg = data.data.channel_msg_rsp.rpt_channel_msg[0];
            let begIndex = parseInt(msg.rsp_begin_seq);
            let endIndex = parseInt(msg.rsp_end_seq);
            if (begIndex === 0 && endIndex === 0)
                return this.updated = true;
            this.updated = (begIndex === endIndex);
            for (let i = begIndex; i <= endIndex; ++i) {
                let content = responseParser.base64ToUTF8(msg.rpt_msgs[endIndex - i]).normalize("NFKC");
                if (!content.includes(this.tinyID))
                    continue;
                let response = content.match(new RegExp(`(?<=${responseParser.tinyID}\\))[\\s\\S]*`))[0];
                if (this.latestResponseIndex === null || i > this.latestResponseIndex)
                    commandManager.processResponse(response), this.latestResponseIndex = i;
            }
            let body = JSON.parse(responseParser.receiveParams.init.body);
            body.get_channel_msg_req.rpt_channel_params[0].begin_seq = (endIndex - 5).toString();
            body.get_channel_msg_req.rpt_channel_params[0].end_seq = (endIndex + 25).toString();
            body.msg_box_get_req.cookie = "";
            responseParser.receiveParams.init.body = JSON.stringify(body);
        }).catch(error => console.error(`Failed to fetch response: ${error}`), this.updated = true);
        this.scheduleUpdate();
    }
    /**
     * 
     * @param {string} base64 - The base64 encoded string.
     * @returns {string} - The decoded UTF-8 string.
     */
    base64ToUTF8(base64) { return new TextDecoder('utf-8').decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0))) };
    /**
     * 
     * @param {string} utf8 - The UTF-8 string.
     * @returns {string} - The base64 encoded string.
     */
    UTF8Tobase64(utf8) { return btoa(new TextEncoder().encode(utf8).reduce((acc, c) => acc + String.fromCharCode(c), '')) };
}

const gameState = new GameState();
const commandManager = new CommandManager(gameState);
const responseParser = new ResponseParser();

function hookFetch() {
    unsafeWindow.fetch = async function (input, init) {
        if (responseParser.receiveParams === null || responseParser.tinyID === undefined) {
            if (input.includes('HandleProcess?msg=1&polling') && responseParser.receiveParams === null)
                responseParser.receiveParams = { input, init };
            if (input.includes('sendmsg/HandleProcess?bkn') && responseParser.tinyID === undefined) {
                responseParser.sendParams = { input, init };
                responseParser.tinyID = JSON.parse(init.body).msg?.head?.routing_head?.from_tinyid;
            }
            if (responseParser.receiveParams !== null && responseParser.tinyID !== undefined) {
                if (JSON.parse(responseParser.receiveParams.init.body).get_channel_msg_req.rpt_channel_params[0].channel_id !== JSON.parse(responseParser.sendParams.init.body).msg.head.routing_head.channel_id) {
                    console.error('Channel ID mismatch');
                    responseParser.receiveParams = null;
                    responseParser.tinyID = undefined;
                } else
                    initMetadata();
            }
        }
        if (input.includes('sendmsg/HandleProcess?bkn')) {
            JSON.parse(init.body)?.msg?.body?.rich_text?.elems
                ?.filter(elem => typeof elem.text?.bytes_pb_reserve === 'string' && elem.text?.bytes_pb_reserve !== "GAIovIWNpPKAgIAC")
                .forEach(elem => console.log({ str: Utils.base64ToUTF8(elem.text.str), bytes_pb_reserve: elem.text.bytes_pb_reserve }));
        }
        return originalFetch(input, init);
    }
};

/**
 * Starts the main loop.
 * @returns {Promise<void>}
 */
async function loop() {
    commandManager.scheduleCommand('吸收灵力');
    commandManager.scheduleCommand('药园');
    commandManager.scheduleCommand('查看宗门悬赏');
    commandManager.scheduleCommand('大混战报名');
    if (gameState.metadata.fightTarget)
        scheduleFight();
    if (gameState.metadata.woodPrice)
        commandManager.scheduleCommand('我的树木');
}
/**
 * @return {Promise<void>}
 */
async function scheduleFight() {
    if (gameState.metadata.fightTarget)
        commandManager.scheduleCommand(Utils.getFightCommand());
    else
        console.error('No fight target set');
}
/**
 * Performs daily tasks.
 * @param {number} forgeType - The type of item to forge.
 * @returns {Promise<void>}
 */
async function doDailyTasks(forgeType, doSectTasks = false) {
    if (forgeType !== undefined)
        setMetadata('forgeType', forgeType);
    gameState.dailyTasks = {
        killCount: 0,
        challengeCount: 0,
        forgeCount: 0,
        towerCount: 0,
        worshipCount: 0,
        fightCount: 0,
        schoolFightCount: 0,
        sectChallengeCount: 0,
        sectFightCount: 0,
    }
    commandManager.scheduleCommand('宗门签到');
    commandManager.scheduleCommand('签到');
    commandManager.scheduleCommand('送能量');
    commandManager.scheduleCommand('领每日能量');
    commandManager.scheduleCommand('传功');
    commandManager.scheduleCommand('砍一刀');
    commandManager.scheduleCommand('挑战噬魂兽');
    commandManager.scheduleCommand('塔攻击');
    commandManager.scheduleCommand('膜拜排位 1');
    commandManager.scheduleCommand(gameState.metadata.fightTarget ? `师门切磋 1` : `随机试剑 1`);
    if (gameState.metadata.fightTarget)
        commandManager.scheduleCommand(Utils.getFightCommand());
    if (gameState.metadata.forgeType)
        commandManager.scheduleCommand(`锻造 ${gameState.metadata.forgeType}`);
    if (doSectTasks)
        commandManager.scheduleCommand('开始宗门任务');
}
/**
 * Performs instances.
 * @param {number} level - The character's level.
 * @param {number} secretRealmLevel - The secret realm level.
 * @param {number} zooLevel - The zoo level.
 */
async function enterInstances(level, secretRealmLevel, zooLevel) {
    secretRealmLevel = secretRealmLevel ?? Math.floor((level - 28) / 18);
    zooLevel = zooLevel ?? Math.floor((level - 10) / 9);
    commandManager.scheduleCommand(`进入秘境 ${secretRealmLevel}`);
    commandManager.scheduleCommand(`进入妖兽园 ${zooLevel}`);
    if (level >= 500)
        commandManager.scheduleCommand('进入幻境');
}
/**
 * Enters the hell instance.
 * @param {number} hellLevel - The maximum hell level to attack boss.
 */
async function enterHell(hellLevel) {
    if (hellLevel !== undefined)
        setMetadata('hellLevel', hellLevel);
    const date = new Date();
    const base = `xbhz${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    GM.xmlHttpRequest({ url: `https://xb.qiihao.com:8443/kv?base=${base}` }).then(response => {
        const hellData = JSON.parse(response.responseText);
        gameState.metadata.hellData = JSON.parse(response.responseText);
        if (!hellData || !hellData.data)
            throw new Error('Invalid hell data');
        commandManager.scheduleCommand('地狱寻宝');
    }).catch(error => {
        console.error(`Failed to fetch hell data: ${error}`);
    });
}
/**
 * Initializes the metadata from GM storage.
 * @returns {void}
 */
function initMetadata() {
    if (responseParser.tinyID === undefined)
        throw new Error('TinyID not initialized');
    gameState.metadata.meditationType = GM_getValue(`meditationType_${responseParser.tinyID}`, undefined);
    gameState.metadata.seedType = GM_getValue(`seedType_${responseParser.tinyID}`, undefined);
    gameState.metadata.bountyType = GM_getValue(`bountyType_${responseParser.tinyID}`, "帮扶凡间疾苦|保护我方大殿|保护我方药园|解救被困修士|铲除山贼保护城镇|度化恶灵|铲除妖兽|保护我方岩矿|抵御外族入侵|铲除邪修|游历古战场|游历五龙池");
    gameState.metadata.forgeType = GM_getValue(`forgeType_${responseParser.tinyID}`, undefined);
    gameState.metadata.forgeCount = GM_getValue(`forgeCount_${responseParser.tinyID}`, 50);
    gameState.metadata.hellLevel = GM_getValue(`hellLevel_${responseParser.tinyID}`, 20);
    gameState.metadata.woodPrice = GM_getValue(`woodPrice_${responseParser.tinyID}`, undefined);
    gameState.metadata.fightTarget = GM_getValue(`fightTarget_${responseParser.tinyID}`, undefined);
    commandManager.metadata.botName = GM_getValue(`botName_${responseParser.tinyID}`, '@唐诗修仙');
    commandManager.metadata.notificationEnabled = GM_getValue(`notificationEnabled_${responseParser.tinyID}`, true);
}
/**
 * Sets a metadata value.
 * @param {string} key - The metadata key.
 * @param {any} value - The metadata value.
 * @returns {void}
 */
function setMetadata(key, value) {
    if (responseParser.tinyID === undefined)
        throw new Error('TinyID not initialized');
    if (!['meditationType', 'seedType', 'bountyType', 'forgeType', 'forgeCount', 'hellLevel', 'woodPrice', 'fightTarget', 'botName', 'notificationEnabled'].includes(key))
        throw new Error(`Invalid metadata key: ${key}`);
    if (key === 'meditationType' && ![1, 10, 20, 30, 40, 50, undefined].includes(value))
        throw new Error(`Invalid meditation type: ${value}`);
    if (key in gameState.metadata)
        gameState.metadata[key] = value;
    if (key in commandManager.metadata)
        commandManager.metadata[key] = value;
    GM_setValue(`${key}_${responseParser.tinyID}`, value);
}
function listValues() {
    /**
     * 
     * @param {string} a 
     * @param {string} b 
     * @returns {number}
     */
    function sortKey(a, b) {
        const [nameA, idA] = a.split('_');
        const [nameB, idB] = b.split('_');
        if (idA === idB)
            return nameA.localeCompare(nameB);
        return parseInt(idA) - parseInt(idB);
    }
    for (const key of GM_listValues().sort(sortKey))
        console.log(`${key}: ${GM_getValue(key)}`);
}
function deleteValue(key) {
    GM_deleteValue(key);
}
function deleteValues() {
    GM_listValues().forEach(key => GM_deleteValue(key));
}

unsafeWindow.gameState = gameState;
unsafeWindow.commandManager = commandManager;
unsafeWindow.responseParser = responseParser;
unsafeWindow.loop = loop;
unsafeWindow.scheduleFight = scheduleFight;
unsafeWindow.doDailyTasks = doDailyTasks;
unsafeWindow.enterInstances = enterInstances;
unsafeWindow.enterHell = enterHell;
unsafeWindow.scheduleCommand = commandManager.scheduleCommand;
unsafeWindow.setMetadata = setMetadata;
unsafeWindow.listValues = listValues;
unsafeWindow.deleteValue = deleteValue;
unsafeWindow.deleteValues = deleteValues;

const originalFetch = unsafeWindow.fetch;
hookFetch();