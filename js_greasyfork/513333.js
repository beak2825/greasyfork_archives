// ==UserScript==
// @name         Introduction
// @namespace    http://tampermonkey.net/
// @version      0.1.15
// @description  Do it all
// @include https://*.the-west.*/game.php*
// @include https://*.the-west.*.*/game.php*
// @exclude https://*.the-west.net/*
// @icon         https://westru.innogamescdn.com/images/window/character/buff_greenhorn.png
// @grant        none
// @run-at document-body
// @license MIT
// @require https://update.greasyfork.org/scripts/490628/1468386/Ajax%20Async%20Lib.js
// @downloadURL https://update.greasyfork.org/scripts/513333/Introduction.user.js
// @updateURL https://update.greasyfork.org/scripts/513333/Introduction.meta.js
// ==/UserScript==


(function () {
    const town_player_name = "Nevermind";
    const items_to_sell = ["Летнее пончо"]

    Player.Welcome.init = function() {};

    const token = "7194106399:AAHjteUE6YljOAOLU5ILdGVRQXwtcEgWt5k";
    const chatId = 1005292580;
    const maxJobs = Premium.hasBonus('automation') ? 9 : 4;
    const notify = function (msg) {
        let message = `[${Game.worldName}] ${Character.name}: ${msg}`
        fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`);
    };
    const makeAvatar = async function () {

        await AjaxAsync.remoteCall('character', 'change_avatar', {
            "head": "male_white/avatar_male_blank",
            "eyes": "male_white/eyes/male_white_eyes_1",
            "nose": "male_white/nose/male_white_nose_1",
            "mouth": "male_white/mouth/male_white_mouth_1",
            "hatsb": "male_white/hatsb/hat_1_b",
            "hair": "male_white/hair/male_hair_bald",
            "clothing": "male_white/clothing/male_clothing_coat",
            "beards1": "male_white/beards1/beard_full_blonde",
            "hatsa": "male_white/hatsa/hat_1_a",
            "pose": "male_white/pose/transparent",
            "background": "bg0",
            "sex": "male",
            "color": "white"
        });
    }

    setInterval(function() {
        var sessao = $('.tw2gui_dialog .tw2gui_dialog_text').text().slice(-15);

        if (sessao == "Сеанс завершён.") {
            let world = Game.gameURL.replace(/\D/g, '');
            window.location.replace(`/#new${world}`);
        }
    }, 30000);

    // EventHandler.listen("chat_init", async function () {
    //     await AjaxAsync.wait(1000);
    //     for (const r in Chat.MyClient.rooms)
    //         if (Chat.MyClient.rooms[r])
    //             Chat.Request.SetOnlineState(r, false)
    //     await AjaxAsync.wait(1000);
    //     //Chat.Router.disconnect();
    // });
    EventHandler.listen("character_level_up", async function (args) {
        console.log(args);
        if (Character.level > 2)
            Introduction.setSkills(Introduction.attributes, Introduction.skills)
        else if (Character.level == 2) {
            Introduction.setSkills("strength", "health", 1, 1)
        }
        if (Character.level == 15) {
            checkAndUse(items.beginnerBag03);

            // 50 облиг отправка имеила, доступна после 3 введения
            await Introduction.AcceptQuestAsync(943);
            await AjaxAsync.remoteCall('character', 'invite_mail', { player_name: Character.name, friend_name: "Ковбой", mail_address: "thewestttt4@gmail.com", message: "" });
            await Introduction.FinishQuestAsync(943);

            // поставить аву 
            await makeAvatar();
            // выбрать трудягу
            let response = await AjaxAsync.remoteCall('class_choose', 'choose', { charclass: "worker" });
        }
        if (Character.level == 4) {
            await getBoots();
        }
        if (Character.level == 5) {
            checkAndUse(items.beginnerBag01);
        }
        if (Character.level == 10) {
            checkAndUse(items.beginnerBag02);
        }
        if (Character.level == 9) {
            if (Character.position.x != 44926) return;
            if (Character.position.y != 17992) return;
            // пончо у текумсеха
            for (let id = 1563; id <= 1576; id++) {
                await Introduction.AcceptQuestAsync(id);
                await Introduction.FinishQuestAsync(id);
                await AjaxAsync.wait(1000);
            }
            EventHandler.signal('inventory_changed');
            await AjaxAsync.wait(1000);
            Wear.carry(Bag.getItemByItemId(40000000));
        }
    });

    let getBoots = async function () {
        const boots = 438000;
        if (Bag.getItemByItemId(boots)) {
            Wear.carry(Bag.getItemByItemId(boots));
            return;
        }
        if (await isWearing(boots)) return;
        // башмаки
        for (let id of [1550, 1551, 1552, 1553, 1555, 1557]) {
            await Introduction.AcceptQuestAsync(id);
            await Introduction.FinishQuestAsync(id);
            await AjaxAsync.wait(1000);
        }
        EventHandler.signal('inventory_changed');
        await AjaxAsync.wait(1000);
        Wear.carry(Bag.getItemByItemId(boots));
    }

    let currentQuestId = null;
    LinearQuestHandler.init_original = LinearQuestHandler.init;
    LinearQuestHandler.init = function (quests) {
        if (quests && quests.length > 0) currentQuestId = quests[0].questid;
        console.log("currentQuestId now is ", currentQuestId)
        LinearQuestHandler.init_original(quests);
    }
    LinearQuestHandler.hasTutorialQuest = function () { return false };
    EventHandler.listen("linearquest_added", async function (quest) {
        await AjaxAsync.wait(1000);
        LinearQuestHandler.remove(quest);
    });
    TutorialManager.job_tutorial = 0;


    Introduction = {
        achievementId: 80302,
        //skills: 'tactic',
        //skills: 'punch',
        //skills: 'endurance',
        skills: 'build',
        //skills: 'reflex',
        //skills: 'ride',
        //skills: 'repair',
        //skills: 'trade',
        attributes: 'strength'
        //attributes: 'flexibility'
        //attributes: 'dexterity'
        //attributes: 'charisma'
    }

    Introduction.npcDuel = async function () {
        const result = await AjaxAsync.remoteCall('duel', 'get_data', {});
        const first = result.npcs.npcs[0];
        await AjaxAsync.remoteCall('duel', 'duel_npc', { duelnpc_id: first.duelnpc_id });
    };

    const isWearing = async function (itemId) {
        let type = ItemManager.get(itemId).type;
        if (Wear.wear[type] == undefined) return false;
        return Wear.wear[type].obj.item_id == itemId;
    };

    const waitEquip = async function (item) {
        while (!isWearing(item)) {
            await AjaxAsync.wait(10);
        }

        return Promise.resolve(true);
    };

    Introduction.Linearquests = {
        [0]: async function () { },
        [1]: async function () { await Introduction.npcDuel(); },
        [2]: async function () { },
        [3]: async function () { },
        [4]: async function () { await completeJob(jobs.banditry); },
        [5]: async function () { await completeJob(jobs.lambs, 2); },
        [6]: async function () { await findProduct(jobs.fish); },
        [7]: async function () { },
        [8]: async function () { await findProduct(jobs.coffee); },
        [9]: async function () { await AjaxAsync.wait(5000); const scarf = 41031000; if (!(await isWearing(scarf))) Wear.carry(Bag.getItemByItemId(scarf)); await waitEquip(scarf); },
        [10]: async function () { },
        [11]: async function () { },
    };
    const buffs = {
        mate100: 2130000,
        guarana: 2129000,
        coffee: 2128000,
        ratatui: 51127000,

        cap: 52498000,
        avocado: 53502000,
        beansSpeed: 53504000,

    };

    const items = {
        beginnerBag01: 2329000,
        beginnerBag02: 2330000,
        beginnerBag03: 2331000,
        beginnerBag04: 2332000,
        beginnerBag05: 2333000,
        friendBag: 13711000,

        obl40: 2393000,
        obl50: 2137000,
        obl90: 2394000,
        obl100: 2138000,
        obl200: 2395000,
        obl250: 2139000,
        obl550: 2396000,

        greenCloth: 51248000,
        lucielSkirt: 51252000,
        lucielTop: 51254000,

        speedPowder: 2135000,
    };

    let lucieItems = {
        neck: 730000,
        picture: 786000,
        whiskey: 1708000,
        cards: 1819000,
        lasso: 749000,
        lucielLasso: 51247000,

        ticket: 759000,
        tomato: 793000,
        tobacco: 702000,
        flower: 745000,
        corn: 748000,
        fish: 717000,
        turkey: 709000,
        tequila: 792000,
    }

    Introduction.DoMain = async function () {
        if (currentQuestId == null) {
            console.log("Вводный квест уже пройден");
            return;
        }

        //TutorialManager.removeClouds();
        west.Feature.unlock('questbook');
        west.Feature.unlock('duels');
        west.Feature.unlock('multiplayer');
        west.Feature.unlock('skills');
        SkillsWindow.blockSkills = false
        SkillsWindow.blockAttributes = false

        for (let i = currentQuestId; i <= 11; i++) {
            await AjaxAsync.remoteCall('linearquest', 'accept_linear_quest', { groupid: 1, questid: i });
            await Introduction.Linearquests[i]();
            await AjaxAsync.wait(1000);
            await AjaxAsync.remoteCall('linearquest', 'finish_linear_quest', { groupid: 1, questid: i });
            EventHandler.signal('inventory_changed');
        }

        checkAndUse(items.beginnerBag01);
        checkAndUse(items.friendBag);

        if (Player.emailValid) {
            await Introduction.AcceptQuestAsync(155);
            await Introduction.FinishQuestAsync(155);
        }
        setTimeout(() => { window.Map.blikSpamBot.start(); }, 1000);

        await AjaxAsync.remoteCall('loginbonus', 'collect');
        await AjaxAsync.wait(3000);
    }

    let checkAndUse = async function (id) {
        if (Bag.getItemByItemId(id)) {
            await useItem(id);
            return true;
        }

        return false;
    }

    let useItem = async function (itemId) {
        console.log(`Хочу подбухнуть ${ItemManager.get(itemId).name}`);
        let res = await AjaxAsync.remoteCall("itemuse", "use_item", {
            item_id: itemId,
            lastInvId: Bag.getLastInvId()
        });
        if (res.error) return;

        if (Character.cooldown != res.msg.cooldown) {
            Character.cooldown = res.msg.cooldown;
            EventHandler.signal("cooldown_changed");
        }
        Bag.updateChanges(res.msg.changes || {});
        if (!res.msg.effects) return;

        for (i = 0; i < res.msg.effects.length; i += 1) {
            m = res.msg.effects[i];
            switch (m.type) {
                case 'hitpoints':
                    Character.setHealth(m.hitpoints);
                    break;
                case 'duel_motivation':
                    Character.setDuelMotivation(m.duelmotivation);
                    break;
                case 'work_motivation':
                    EventHandler.signal('jobmotivation_change');
                    break;
                case 'hitpoints':
                    Character.setHealth(m.hitpoints);
                    break;
                case 'buff':
                    Character.setSpeed(m.char_speed);
                    WearSet.setWorkPointBonus(m.workPointBonus);
                    CharacterSkills.setBuffs(m.all);
                    CharacterSkills.updateAllBonuspoints(m.bonus.allBonuspoints);
                    break;
            }
        }
    }

    let completeJob = async function (job, count = 1) {
        Introduction.startJob(job, count);
        await AjaxAsync.WaitJobsAsync();
    }

    let findProduct = async function (job, count = 1, attempts = 1) {
        let isFound = function () { return Bag.getItemByItemId(job.productId)?.count >= count; }
        while (!isFound()) {
            await completeJob(job, attempts);
            await AjaxAsync.wait(1000);
        }
    }

    let findProduct4 = async function (job, count = 1) {
        await findProduct(job, count, 4);
    }

    let goToEmployer = async function (employer) {
        TaskQueue.add(new TaskWalk(employer.key, 'questgiver', employer.employer_coords.x, employer.employer_coords.y));
        await AjaxAsync.WaitJobsAsync();
    }

    let jobs = {
        "banditry": { "id": 128, "x": 44419, "y": 17873, "duration": 15, productId: 0 },
        "lambs": { "id": 130, "x": 44169, "y": 17887, "duration": 15, productId: 0 },
        "fish": { "id": 127, "x": 43879, "y": 17869, "duration": 15, productId: 2160000 },
        "coffee": { "id": 129, "x": 43638, "y": 17956, "duration": 15, productId: 2162000 },
        "tabacco": { "id": 4, "x": 44419, "y": 17873, "duration": 15, productId: 702000 },
        "field": { "id": 2, "x": 44419, "y": 17873, "duration": 15, productId: 757000 },
        "fishing": { "id": 7, "x": 43879, "y": 17869, "duration": 15, productId: 0 },
        "sugar": { "id": 6, "x": 41194, "y": 16700, "duration": 15, productId: 703000 },
        "shoes": { "id": 93, "x": 43330, "y": 15764, "duration": 15, productId: 0 },
        "pigs": { "id": 1, "x": 44169, "y": 17887, "duration": 15, productId: 0 },
        "pickCotton": { "id": 5, "x": 44419, "y": 17873, "duration": 15, productId: 704000 },
        "harvest": { "id": 8, "x": 44419, "y": 17873, "duration": 15, productId: 744000 },
        "posterPasting": { "id": 3, "x": 43638, "y": 17956, "duration": 15, productId: 743000 },
        "sellMagazines": { "id": 11, "x": 43638, "y": 17956, "duration": 15, productId: 701000 },
        "huntTurkey": { "id": 20, "x": 44043, "y": 16836, "duration": 15, productId: 709000 },
        "pickBeans": { "id": 15, "x": 41194, "y": 16700, "duration": 15, productId: 746000 },
        "pickBerries": { "id": 9, "x": 44334, "y": 17374, "duration": 15, productId: 706000 },
        "spors": { "id": 94, "x": 43638, "y": 17956, "duration": 15, productId: 1807000 },
        "logging": { "id": 27, "x": 44334, "y": 17374, "duration": 15, productId: 711000 },
        "leatherTanning": { "id": 17, "x": 43607, "y": 18409, "duration": 15, productId: 712000 },
        "grazingCows": { "id": 22, "x": 44169, "y": 17887, "duration": 15, productId: 710000 },

        "buildStation": { "id": 43, "x": 7757, "y": 400, "duration": 15, productId: 759000 },
        "pickingTomato": { "id": 87, "x": 8166, "y": 855, "duration": 15, productId: 793000 },

        "millingGrain": { "id": 13, "x": 43607, "y": 18409, "duration": 15, productId: 745000 },
        "pickingCorn": { "id": 14, "x": 41194, "y": 16700, "duration": 15, productId: 748000 },
        "fishnetFishing": { "id": 42, "x": 43879, "y": 17869, "duration": 15, productId: 717000 },
        "pickAgava": { "id": 86, "x": 43077, "y": 17347, "duration": 15, productId: 792000 },

        // 2 means 2 square
        "sellMagazines2": { "id": 11, "x": 7720, "y": 2256, "duration": 15, "productId": 744000 },
        "tabacco2": { "id": 4, "x": 8567, "y": 1269, "duration": 15, "productId": 702000 },
        "huntTurkey2": { "id": 20, "x": 10730, "y": 269, "duration": 15, "productId": 709000 },
        "millingGrain2": { "id": 13, "x": 9039, "y": 3221, "duration": 15, "productId": 745000 },
        "pickingCorn2": { "id": 14, "x": 7910, "y": 1328, "duration": 15, "productId": 748000 },
        "pickingTomato2": { "id": 87, "x": 8166, "y": 855, "duration": 15, "productId": 793000 },
        "fishnetFishing2": { "id": 42, "x": 9490, "y": 1058, "duration": 15, "productId": 717000 },
        "buildStation2": { "id": 43, "x": 7757, "y": 400, "duration": 15, "productId": 759000 },
        "pickAgava2": { "id": 86, "x": 8166, "y": 855, "duration": 15, "productId": 792000 },

        "catchHorses2": { "id": 48, "x": 11429, "y": 2724, "duration": 15, "productId": 749000 },
        "grazingCows2": { "id": 22, "x": 8700, "y": 1442, "duration": 15, "productId": 710000 },
        "breakingHorse2": { "id": 35, "x": 11429, "y": 2724, "duration": 15, "productId": 787000 },
    }

    Introduction.PremiumQuests = {
        // введение на прем
        [0]: async function () { },
        [1]: async function () { await completeJob(jobs.tabacco); },
        [2]: async function () { await completeJob(jobs.field); },
        [3]: async function () { await completeJob(jobs.fishing); },
        [4]: async function () { },
        [5]: async function () { },
        [6]: async function () { await completeJob(jobs.sugar, 2); },
        [7]: async function () { await completeJob(jobs.shoes); },
        [8]: async function () { },
        [1591]: async function () { },
        //[155]: async function () { },
        [1558]: async function () { },
        [1559]: async function () { await Introduction.buyMinimalItem(); },
        [1560]: async function () { await Introduction.buyAndUseChechaco(); },
        [1561]: async function () { },
        [1562]: async function () { },
    };


    const waitForSaturday = async function () {
        console.log("Буду ждать субботу!");
        while (true) {
            if ((new Date()).getDay() === 6) {
                console.log("Суббота!");
                break;
            }

            await AjaxAsync.wait(60000);
        }
    };
    Introduction.LucileQuests = {
        // все ресы должны быть получены заранее, далее просто сдаем квесты и бегаем по точкам
        [3074]: async function () { },
        [3075]: async function () { },
        [3076]: async function () { await checkAndUse(items.obl40) },
        [3077]: async function () { },

        [3078]: async function () { },

        [3079]: async function () { await Introduction.DoJobCount(jobs.grazingCows2, 50); await Introduction.DoJobCount(jobs.catchHorses2, 35); await goToEmployer(lucieEmployers.mainstory_6_saloon); },
        [3080]: async function () { await Introduction.DoJobCount(jobs.breakingHorse2, 45); await goToEmployer(lucieEmployers.mainstory_6_saloon); },
        [3081]: async function () { await Introduction.DoJobCount(jobs.breakingHorse2, 45); await goToEmployer(lucieEmployers.mainstory_6_saloon); },
        [3082]: async function () { },
    };

    let getBelt = async function () {
        // текумсех
        await Introduction.AcceptQuestAsync(1577);
        for (let id = 1578; id <= 1587; id++) {
            await Introduction.AcceptQuestAsync(id);
            await Introduction.setSkills(Introduction.attributes, Introduction.skills, 0, 1);
            await Introduction.FinishQuestAsync(id);
            await AjaxAsync.wait(1000);
        }
        await Introduction.FinishQuestAsync(1577);
        EventHandler.signal('inventory_changed');
        await AjaxAsync.wait(1000);
        Wear.carry(Bag.getItemByItemId(11118000));
    };
    Introduction.Quests = {
        // почта на всякий
        //[155]: async function () { },

        // машка
        [120]: async function () { try { Wear.carry(Bag.getItemByItemId(10148000)); } catch { } await completeJob(jobs.pigs, 4); },
        [121]: async function () { await findProduct(jobs.pickCotton); },
        [122]: async function () { await completeJob(jobs.harvest, 4); },
        [123]: async function () { await completeJob(jobs.posterPasting, 4); },

        // шериф
        [23]: async function () { await findProduct(jobs.posterPasting); },
        [24]: async function () { Wear.carry(Bag.getItemByItemId(2000)); },
        [25]: async function () { await completeJob(jobs.sellMagazines, 4); },
        [26]: async function () { },

        // вупи
        [27]: async function () { await findProduct(jobs.tabacco); },
        [28]: async function () { await findProduct(jobs.field); },
        [29]: async function () { await findProduct(jobs.pickBeans); },
        [30]: async function () { await findProduct(jobs.sugar); },
        [31]: async function () { await checkAndUse(2164000); await findProduct(jobs.huntTurkey); },
        [32]: async function () { },
        [180]: async function () { await findProduct(jobs.pickBerries); },

        // введение 3
        [530]: async function () { },
        [531]: async function () { await completeJob(jobs.spors, 4); Wear.carry(Bag.getItemByItemId(1805000)); },
        [532]: async function () { await completeJob(jobs.pickCotton, 2); },
        [533]: async function () { },
        [534]: async function () { },
        [535]: async function () { await AjaxAsync.remoteCall('shop_trader', 'sell', { inv_id: Bag.getItemByItemId(569000).inv_id, count: 1, last_inv_id: Bag.getLastInvId() }); Wear.carry(Bag.getItemByItemId(569000)); },
        [536]: async function () { },
        [537]: async function () { Wear.carry(Bag.getItemByItemId(607000)); await findProduct(jobs.tabacco); },
        [538]: async function () { await goToEmployer(employers.tiny_eagle); await Introduction.AcceptQuestAsync(539); await findProduct(jobs.logging, 2); await goToEmployer(employers.tiny_eagle); Wear.carry(Bag.getItemByItemId(262000)); await Introduction.FinishQuestAsync(539) },
        [540]: async function () { await completeJob(jobs.leatherTanning, 4); await goToEmployer(employers.tiny_eagle); },
        [541]: async function () { await completeJob(jobs.huntTurkey, 4); await goToEmployer(employers.tiny_eagle); await getBelt(); },
        [542]: async function () { await completeJob(jobs.grazingCows, 4); },
        [543]: async function () { return 33 }, // axe
        [544]: async function () { Wear.carry(Bag.getItemByItemId(52000)); },
    };

    let saloon = {
        "barkeeper": { employer_coords: {} },
        "lady": { employer_coords: {} },
        "sheriff": { employer_coords: {} },
        "indian": { employer_coords: {} },
    }

    let employers = {
        ...saloon,
        "tiny_eagle": { key: "tiny_eagle", employer_coords: { x: 44926, y: 17992 } },
    }

    let lucieEmployers = {
        "barkeeper": { employer_coords: {} },
        "lady": { employer_coords: {} },
        "indian": { employer_coords: {} },
        "sheriff": { employer_coords: {} },
        "mainstory_6_saloon": { key: "mainstory_6_saloon", employer_coords: { x: 11449, y: 1805 } },
    }

    Introduction.doItPremium = async function () {

        if (await questCompleted("84", "1562")) {
            console.log("Прем за квест уже получен");
            return;
        }

        await this.DoMain();

        // let achievementResp = await AjaxAsync.remoteCall('achievement', 'track', { achvid: this.achievementId });
        // if (achievementResp.error) return new MessageError(achievementResp.msg).show();
        // else Character.setTrackingAchievement(achievementResp);

        let currentQuestId = null;
        while (currentQuestId != 1562) {
            currentQuestId = await Introduction.DoQuests(Introduction.PremiumQuests, employers);
        }

        // await Introduction.buyUP("useables", buffs.avocado);
        // await requireTownInvite();
    }

    let getQuestsHistory = async function () {
        let response = await AjaxAsync.remoteCallMode("building_quest", "get_solved_groups")

        return response;
    };

    let questCompleted = async function (groupId, questId) {
        let solved = (await getQuestsHistory()).solved[groupId];
        return solved && solved.quests[questId]
    };

    Introduction.doItAll = async function () {
        if (await questCompleted("55", "544")) {
            new UserMessage("Введение 3 уже пройдено").show();
            return;
        }

        await this.doItPremium();
        let currentQuestId = null;
        while (currentQuestId != 544) {
            currentQuestId = await Introduction.DoQuests(Introduction.Quests, employers);
        }
    }
    
    Introduction.doItPartial = async function () {
        if (await questCompleted("55", "537")) {
            new UserMessage("Введение 3 уже пройдено").show();
            return;
        }

        await this.doItPremium();
        let currentQuestId = null;
        while (currentQuestId != 537) {
            currentQuestId = await Introduction.DoQuests(Introduction.Quests, employers);
        }
    }

    let checkAndBuy = async function (itemId, currency = 1) {
        let item = Bag.getItemByItemId(itemId);
        if (!item) await Introduction.buyUP("useables", itemId, currency);
    };

    let prepareLucile = async function () {
        const groupId = "194";
        let solved = (await getQuestsHistory()).solved[groupId] || {};
        await Introduction.doItAll();
        let quests = solved.quests || {};

        if (!quests[3075]) await checkAndBuy(items.greenCloth);

        if (!Bag.getItemByItemId(lucieItems.neck)) {
            await acceptTownInvite();
            await buyItemOnTownMarket(lucieItems.cards);
            await buyItemOnTownMarket(lucieItems.lasso);
            await buyItemOnTownMarket(lucieItems.picture);
            await buyItemOnTownMarket(lucieItems.whiskey);
            await buyItemOnTownMarket(lucieItems.neck);

            await buyItemOnTownMarket(lucieItems.ticket, true);
            await buyItemOnTownMarket(lucieItems.corn, true);
            await buyItemOnTownMarket(lucieItems.tomato, true);
            await buyItemOnTownMarket(lucieItems.tobacco, true);
            await buyItemOnTownMarket(lucieItems.fish, true);
            await buyItemOnTownMarket(lucieItems.flower, true);
            await buyItemOnTownMarket(lucieItems.turkey, true);
            await buyItemOnTownMarket(lucieItems.tequila, true);

            await leaveTown();
        }
        await collectLots();


        if (!quests[3076]) await findProduct4(jobs.tabacco2, 10);
        if (!quests[3074]) await findProduct4(jobs.sellMagazines2);
        if (!quests[3078]) {
            await findProduct4(jobs.huntTurkey2, 10);
            await findProduct4(jobs.millingGrain2, 5);
            await findProduct4(jobs.pickingCorn2, 10);
            await findProduct4(jobs.fishnetFishing2, 5);
        }

        await Introduction.DoLvlUp(32);

        if (!quests[3075] && Character.money > 9600) {
            await checkAndBuy(items.lucielSkirt, 4);
            await checkAndBuy(items.lucielTop, 4);
        }

        if (!quests[3074]) await findProduct4(jobs.buildStation2, 5);
        if (!quests[3078]) await findProduct4(jobs.pickAgava2, 3);
        if (!quests[3078]) await findProduct4(jobs.pickingTomato2, 10);

    };

    Introduction.DoLucile = async function () {
        if (await questCompleted("194", "3082")) {
            new UserMessage("Квест уже на лассо уже пройден").show();
            await Introduction.theEnd();

            return;
        }

        await prepareLucile();

        await requireTownInvite();

        let currentQuestId = null;
        while (currentQuestId != 3082) {
            currentQuestId = await Introduction.DoQuests(Introduction.LucileQuests, lucieEmployers);
            if (currentQuestId == 3078) {
                await checkAndBuy(buffs.beansSpeed);
                await AjaxAsync.wait(5000);
                await checkAndUse(buffs.beansSpeed);
                await goToEmployer(lucieEmployers.mainstory_6_saloon);
                await waitForSaturday();
            }
        }

        EventHandler.signal('inventory_changed');

        await AjaxAsync.wait(5000);

        if (!Bag.getItemByItemId(lucieItems.lucielLasso)) {
            notify("Закончил выполнение, но лассо все еще нет");
            return;
        }

        notify("Лассо готово!");

        await Introduction.theEnd();
    }

    const requireTownInvite = async function () {
        await AjaxAsync.remoteCall('messages', 'send', { to: town_player_name, subject: "привет", text: "кинь приглас", masstelegramm: false });
    };
    const acceptTownInvite = async function () {
        if (Character.homeTown && Character.homeTown.town_id != 0) return;
        let invite = null;

        do {
            const invites = (await AjaxAsync.remoteCallMode("invitations", "get_data"));
            invite = invites.invitations.find(item => item.from_name === town_player_name) || null;
            if (!invite) {
                notify("Нет приглашения в город!");
                await AjaxAsync.wait(300000);
            }
        } while (invite == null)

        const invites = Ajax.remoteCall('invitations', 'accept_invitation', { town_id: invite.town_id });
    };
    const buyItemOnTownMarket = async function (itemId, isOptional = false) {
        async function getLots(itemId) {
            let result = await AjaxAsync.remoteCall("building_market", "search", {
                item_id: itemId,
                page: 1,
                nav: "first",
                order: "asc",
                sort: "bid",
                visibility: 1 // 2 - world, 1 - ally, 0 - town
            });

            return result;
        };
        async function buyItem(offerId, price) {
            let data = await AjaxAsync.remoteCall("building_market", "bid", {
                bidtype: 0, // by cash
                bid: price,
                market_offer_id: offerId
            });
            if (data.error == false && data.msg.instantBuy) return true;
            else console.error("putMoney error: " + data.msg);

            return false;
        };

        let result = await getLots(itemId);
        if (isOptional && result.msg.search_result.length > 0) {
            let searchResultItem = result.msg.search_result[0];
            await buyItem(searchResultItem.market_offer_id, searchResultItem.max_price);
            await AjaxAsync.wait(2000);
        }
        if (isOptional) return;

        while (result.msg.search_result.length == 0) {
            notify(`Закончились ресы! На рынке нет ${ItemManager.get(itemId).name}`);
            await AjaxAsync.wait(30000);
            result = await getLots(itemId);
        }


        let i = 0;
        let searchResultItem = result.msg.search_result[i];
        while (!(await buyItem(searchResultItem.market_offer_id, searchResultItem.max_price))) {
            searchResultItem = result.msg.search_result[++i];
            await AjaxAsync.wait(2000);
        }
    };
    const leaveTown = async function () {
        await AjaxAsync.remoteCall('building_cityhall', 'resign_town');
    };
    const collectLots = async function () {
        function getUniqueTowns(lots) {
            const townsMap = {};
            lots.forEach(lot => {
                const { market_town_id, market_town_x, market_town_y } = lot;
                if (!townsMap[market_town_id]) {
                    townsMap[market_town_id] = {
                        market_town_id: market_town_id,
                        market_town_x: market_town_x,
                        market_town_y: market_town_y
                    };
                }
            });
            return Object.values(townsMap);
        }

        let lots = (await AjaxAsync.remoteCall('building_market', 'fetch_bids')).msg.search_result;
        const towns = getUniqueTowns(lots);

        function calculateDistanceToCharacter(currentPosition, town) {
            const from = { x: currentPosition.x, y: currentPosition.y };
            const to = { x: town.market_town_x, y: town.market_town_y };
            return GameMap.calcWayTime(from, to);
        }

        while (towns.length > 0) {
            let currentPosition = Character.getPosition();
            towns.sort((a, b) => calculateDistanceToCharacter(currentPosition, b) - calculateDistanceToCharacter(currentPosition, a));
            Guidepost.start_walk(towns.pop().market_town_id, 'town');
            while (TaskQueue.queue.length > 0) await new Promise(resolve => setTimeout(resolve, 200));
            if (!(await AjaxAsync.remoteCall('building_market', 'fetch_town_bids')).error) EventHandler.signal('inventory_changed');;
        }
    };

    const checkCharacter = async function () {
        if (Character.energy == 0) {
            (await checkAndUse(buffs.mate100)) || (await checkAndUse(buffs.coffee))
        }
    };

    Introduction.DoJobCount = async function (job, count) {
        await AjaxAsync.WaitJobsAsync();
        while (count > 0) {
            const currentIteration = Math.min(count, maxJobs, Character.energy);
            count -= currentIteration;
            for (let j = 0; j < currentIteration; j++) {
                JobWindow.startJob(job.id, job.x, job.y, 15);
            }
            await AjaxAsync.WaitJobsAsync();
            await checkCharacter();
        }
    }

    Introduction.DoLvlUp = async function (to) {
        if (Character.level >= to) return;

        const getMotivation = async function (id, x, y) {
            let r = await AjaxAsync.get('job', 'job', { jobId: id, x: x, y: y });
            return Math.floor(r.motivation * 100);
        };
        let lvlUpJobs = [
            { "id": [87, 91, 86, 95, 97], "x": 8166, "y": 855 },
            { "id": [21, 28, 37, 43, 44], "x": 7757, "y": 400 },
            { "id": [84, 53, 126], "x": 6799, "y": 701 },
        ];

        let reservJobs = [
            { "id": 98, "x": 7910, "y": 1328 },
            { "id": 96, "x": 8488, "y": 347 },
            { "id": 46, "x": 9341, "y": 1698 },
            { "id": 47, "x": 9341, "y": 1698 },
            { "id": 62, "x": 8594, "y": 2572 },
            { "id": 85, "x": 10222, "y": 268 },
            { "id": 51, "x": 10730, "y": 269 },
            { "id": 48, "x": 11429, "y": 2724 },
            { "id": 35, "x": 11429, "y": 2724 },
            { "id": 38, "x": 12966, "y": 1606 },
            { "id": 45, "x": 12966, "y": 1606 },
            { "id": 61, "x": 5795, "y": 633 },
        ];

        let index = lvlUpJobs.findIndex(job =>
            job.x === Character.position.x && job.y === Character.position.y
        );
        let skipFirst = false;
        if (index == -1) {
            index = 0;
            JobWindow.startJob(86, 8166, 855, 15);
            await AjaxAsync.WaitJobsAsync();
        } else {
            skipFirst = true;
        }

        await checkAndUse(buffs.avocado);

        let direction = 1;
        while (true) {
            const farmPoint = lvlUpJobs[index];

            for (const id of farmPoint.id) {
                let job = JobList.getJobById(id);
                if (!job.canDo()) {
                    console.log(`Пока не могу работать на ${job.name}`);
                    continue;
                }
                let count = await getMotivation(id, farmPoint.x, farmPoint.y) - 75;
                console.log(`Поставил в план ${count} работ на ${job.name}`);
                if (count <= 0) {
                    console.log(`Нет мотивации на ${job.name}. Пропускаю.`);
                    continue;
                }
                while (count > 0) {
                    let currentIteration = Math.min(count, maxJobs, Character.energy);
                    if (currentIteration == 0) {
                        notify("Нет энергии");
                        await AjaxAsync.wait(300000);
                        continue;
                    }
                    count -= currentIteration;
                    for (let j = 0; j < currentIteration; j++) {
                        JobWindow.startJob(id, farmPoint.x, farmPoint.y, 15);
                    }
                    await AjaxAsync.WaitJobsAsync();
                    if (Character.level >= to) return;
                }
                console.log(`Закончил на ${job.name}, меняю работу`);
            }

            index += direction;
            if (index === lvlUpJobs.length || index === -1) {
                console.log(`Прошел полный круг, восстанавливаю мотиву и разворачиваюсь`);
                index -= direction;
                direction *= -1;

                if (skipFirst) {
                    console.log(`Не восстанавливаю мотиву... начинал не с нуля, возможно, остались какие-то работы...`);
                    skipFirst = false;
                    continue;
                }

                await checkAndBuy(buffs.cap);
                await AjaxAsync.wait(5000);
                let motivationIncreased = await checkAndUse(buffs.cap);
                await AjaxAsync.wait(1000);
                if (!motivationIncreased) {
                    notify(`Закончилась мотивация. Мой уровень только ${Character.level}. Приступаю к резервным работам`);
                    break;
                }
            }
        }

        for (const j of reservJobs) {
            let job = JobList.getJobById(j.id);
            if (!job.canDo()) {
                console.log(`Пока не могу работать на ${job.name}`);
                continue;
            }
            let count = await getMotivation(j.id, j.x, j.y) - 75;
            console.log(`Поставил в план ${count} работ на ${job.name}`);
            while (count > 0) {
                let currentIteration = Math.min(count, maxJobs, Character.energy);
                if (currentIteration == 0) {
                    notify("Нет энергии");
                    await AjaxAsync.wait(300000);
                    continue;
                }
                console.log(`Буду работать ${currentIteration} раз`);
                count -= currentIteration;
                for (let k = 0; k < currentIteration; k++) {
                    JobWindow.startJob(j.id, j.x, j.y, 15);
                }
                await AjaxAsync.WaitJobsAsync();
                if (Character.level >= to) return;
            }
            console.log(`Закончил на ${job.name}, меняю работу`);
        }
    }

    Introduction.DoQuests = async function (questsToComplete, employers) {
        let completed = null;
        for (let employer in employers) {
            let emp = await AjaxAsync.remoteCall('quest_employer', '', { employer, x: employers[employer].employer_coords.x, y: employers[employer].employer_coords.y, });
            let quests = emp?.employer?.open ?? [];
            //await AjaxAsync.wait(1000);
            for (let quest of quests) {
                if (quest.id in questsToComplete) {
                    if (!quest.accepted) {
                        await Introduction.AcceptQuestAsync(quest.id);
                        console.log(`Квест ${quest.title} принят.`);
                    } else {
                        console.log(`Квест с ID ${quest.id} уже принят.`);
                    }
                    await Introduction.FinishQuestAsync(quest.id, await questsToComplete[quest.id]());
                    EventHandler.signal('inventory_changed');
                    console.log(`Квест ${quest.title} завершен.`);
                    completed = quest.id;
                    await AjaxAsync.wait(2000);
                    break;
                }
            }
            if (completed) return completed;
        }
    }

    Introduction.buyMinimalItem = async function () {
        let shop = await AjaxAsync.remoteCall('shop_trader', 'mtrader_view');
        let trader = shop.inventory.trader.sort((e, t) => e.price_dollar - t.price_dollar);
        let item = trader[0];
        await AjaxAsync.remoteCall("shop_trader", "buy", {
            item_id: item.item_id,
            category: 'trader',
            currency: item.currency,
        });
    }

    Introduction.buyUP = async function (category, itemId, currency = 1) {
        await AjaxAsync.remoteCall("shop_trader", "buy", {
            item_id: itemId,
            category: category,
            currency: currency,
        });
        EventHandler.signal('inventory_changed');
    }

    Introduction.buyAndUseChechaco = async function () {
        let itemId = 17008000;
        await this.buyUP('chests', itemId);
        await AjaxAsync.remoteCall("itemuse", "use_item", {
            item_id: itemId,
            lastInvId: Bag.getLastInvId()
        });
    }

    Introduction.startJob = function (job, count = 1) {
        for (let i = 0; i < count; i++) {
            JobWindow.startJob(job.id, job.x, job.y, job.duration);
        }
    }

    Introduction.AcceptQuestAsync = async function (id) {
        await AjaxAsync.remoteCall('quest', 'accept_quest', { quest_id: id });
    }

    Introduction.FinishQuestAsync = async function (id, rewardOption, attempt = 0) {
        if (!attempt) attempt = 0;
        if (attempt > 10) return;

        let result = await AjaxAsync.remoteCall("quest", "finish_quest", {
            quest_id: id,
            reward_option_id: rewardOption
        });

        if (result.error) {
            if (id == 155) return; // mail
            if (attempt == 10) notify(`За 10 попыток квест ${id} так и не выполнился: ${JSON.stringify(result)}`);
            await AjaxAsync.wait(3000);
            await this.FinishQuestAsync(id, rewardOption, attempt + 1);
        }
    }

    Introduction.setSkills = async function (attr, skill, attrCount, skillCount) {
        let skillInfo = await AjaxAsync.remoteCallMode('skill', 'overview');
        attrCount = attrCount || skillInfo.open_attrPoints;
        skillCount = skillCount || skillInfo.open_skillPoints;
        let body = {
            "attribute_modifications": {},
            "skill_modifications": {},
            "attribute_points_used": attrCount,
            "skill_points_used": skillCount
        }
        body.attribute_modifications[attr] = attrCount;
        body.skill_modifications[skill] = skillCount;
        let data = await AjaxAsync.remoteCall('skill', 'save_skill_changes', {
            'modifier': 'add',
            "data": JSON.stringify(body)
        });
        CharacterSkills.update(data['char'].attributes, data['char'].skills, false, false);
    }

    let jobIds = {
        fishing: 7,
        berries: 9,
        flower: 13,
        bean: 15, 
        pirit: 18, 
        glass_water: 21,
        saw: 24,
        tomato: 87,
        oranges: 91,
    };

    Introduction.GetRandomJob = async function(jobId) {
        let jobs = await getJobs();
        jobs = jobs.filter(j => j.id === jobId);
        let index = Math.floor(Math.random() * jobs.length);
        let job = jobs[index];

        return job;
    };

    Introduction.SpamWork = async function(jobId) {
        
        bot.itemCooldown = Date.now(),
        bot.openItemsAndUseBuffs();
    };

    Introduction.FarmMotivationBox = async function () {
        await Introduction.doItPremium(); 
        new UserMessage("Фармлю коробку").show();

        await Introduction.buyUP("useables", buffs.ratatui);
        await AjaxAsync.wait(2000);
        await useItem(buffs.ratatui);


        let job = await Introduction.GetRandomJob(jobIds.pirit);
        job.duration = 15;
        await requireTownInvite();

        while (Character.ses_currency.dayofdead < 500) {
            await completeJob(job, 4);
            await checkCharacter();
        }

        notify("Коробка готова!");
        await Introduction.theEnd();
    }
    
    Introduction.FarmPoncho = async function () {
        await AjaxAsync.remoteCall('settings', 'save_text', { "text": "https://greasyfork.org/ru/scripts/492063-dobby2 \n\n\nВЕРНИТЕ ВАРЛАНГА\n\nСВОБОДУ СЕМЕЙНЫМ ПАРАМ\n\n\nРАЗРЕШИТЕ БОЛЬШОЙ ИНВЕНТАРЬn\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n https://greasyfork.org/ru/scripts/492063-dobby2 " });
        // await Introduction.doItAll(); 
        await Introduction.doItPartial(); 
        // await Introduction.doItPremium(); 
        new UserMessage("Фармлю пончо").show();

        await Introduction.buyUP("useables", buffs.ratatui);
        await AjaxAsync.wait(2000);
        await useItem(buffs.ratatui);

        let job = await Introduction.GetRandomJob(jobIds.glass_water);
        job.duration = 15;

        let item = Bag.getItemByItemId(bot.oldWillowBasket);
        let currentCount = item ? item.count : 0;
        while (currentCount !== 10 && Character.level < 10) {
            await completeJob(job, 4);
            await checkCharacter();
            item = Bag.getItemByItemId(bot.oldWillowBasket);
            currentCount = item ? item.count : 0;
        }

        await Introduction.theEnd();
    }

    const injectMarket = function () {
        MarketWindow.onInventoryClick = async function (item) {
            let price = item.obj.price / 2 * count; // not sell_price because of chests
            let params = MarketWindow.Offer.getOfferObject(item.obj.item_id, 0, price, item.count, 1, 0, 1, "");

            let resp = await AjaxAsync.remoteCall('building_market', 'putup', params, MarketWindow);
            if (resp.error) return new UserMessage(resp.msg).show();

            Character.setMoney(resp.msg.money);
            Character.setDeposit(resp.msg.deposit)
            new UserMessage(s('Лот выставлен на торг, комиссия составила %1$', resp.msg.costs), UserMessage.TYPE_SUCCESS).show();
            EventHandler.signal('inventory_changed');
            MarketWindow.Sell.initData();

            return true;
        };
    };

    injectMarket();

    const allOnMarket = async function (itemNames) {
        Inventory.open();

        const signatures = [
            "с днем рождения, зе вест!",
            "с любовью от доктора",
            "забирай, на сомневайся!",
            "акция",
        ];
        
        const randomSignature = signatures[Math.floor(Math.random() * signatures.length)];

        if (itemNames && Array.isArray(itemNames)) {
            for (const keyWord of itemNames) {
                const searchResults = Bag.search(keyWord) || [];
                for (const item of searchResults) {
                    await onMarket(item, randomSignature);
                }
                EventHandler.signal('inventory_changed');
            }
        }
        
        const yieldItems = Bag.getItemsByType('yield');
        if (yieldItems && typeof yieldItems.filter === 'function') {
            const filteredItems = yieldItems.filter(i => i.obj.sellable && i.obj.spec_type == "mapdrop" && i.count > 4);
            for (const item of filteredItems) {
                await onMarket(item, randomSignature);
            }
        }
        
        EventHandler.signal('inventory_changed');
        await AjaxAsync.wait(2000);
    }

    const onMarket = async function (item, signature) {
        let price = item.obj.price / 2 * item.count; // not sell_price because of chests

        
        let params = MarketWindow.Offer.getOfferObject(item.obj.item_id, 0, price, item.count, 1, 2, 7, signature);
        let resp = await AjaxAsync.remoteCall('building_market', 'putup', params, MarketWindow);
        await AjaxAsync.wait(2000);
        if (resp.error) return;
        Character.setMoney(resp.msg.money);
        Character.setDeposit(resp.msg.deposit)
    };

    const waitForMarket = async function () {
        const startTime = Date.now();
        const TIMEOUT_MS = 5 * 60 * 1000;
        let notificationSent = false;

        let resp = await Ajax.remoteCall('building_market', 'fetch_town_offers');
        if (resp.deposit) Character.setDeposit(resp.deposit);
        if (resp.cash) Character.setMoney(resp.cash);

        resp = await Ajax.remoteCall('building_market', 'fetch_offers');
        while (resp.msg.search_result.length > 0) {
            if (!notificationSent && (Date.now() - startTime) >= TIMEOUT_MS) {
                notify("Не могу все продать больше 5 минут: ");
                notify(JSON.stringify(resp));
                notificationSent = true;
            }

            await AjaxAsync.wait(10000);
            resp = await Ajax.remoteCall('building_market', 'fetch_town_offers');
            if (resp.deposit) Character.setDeposit(resp.deposit);
            if (resp.cash) Character.setMoney(resp.cash);
            resp = await Ajax.remoteCall('building_market', 'fetch_offers');
        }
    }

    const unwear = async function () {
        const clothCategories = ['belt', 'body', 'foot', 'head', 'neck', 'pants', 'right_arm', 'left_arm', 'yield', 'animal']; //'animal',

        for (let i = 0; i < clothCategories.length; i++) {
            let category = clothCategories[i];
            if (Wear.wear[category]) {
                Wear.uncarry(category);
                while (Wear.wear[category]) await AjaxAsync.wait(300);
            }
        }
    };

    const sellAll = async function () {
        var botConsole = {};
        botConsole.sellAllItems = async function () {
            var types = ['head', 'neck', 'body', 'pants', 'belt', 'foot', 'right_arm', 'left_arm', 'animal'];
            var allItems = [];
            types.forEach(type => {
                allItems.push(...Bag.getItemsByType(type));
            });

            console.log('items to sell count: ', allItems.length);
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                if (item && item.obj) {
                    console.log('selling ' + item.obj.name + ' x ' + item.count);
                    await botConsole.sellItem(item.obj.item_id, item.count);
                    await AjaxAsync.wait(2200);
                }
            };
        }


        botConsole.sellItem = async function (id, count) {
            var data = {
                inv_id: Bag.getItemByItemId(id).inv_id,
                count: count,
                last_inv_id: Bag.getLastInvId()
            };
            let json = await AjaxAsync.remoteCall('shop_trader', 'sell', data);
            if (json.error) new UserMessage(json.error, UserMessage.TYPE_ERROR).show();
            else {
                Character.setMoney(json.money);
                Bag.updateChanges(json.changes) || {};
            }
        }

        await botConsole.sellAllItems();
    }


    Introduction.theEnd = async function () {
        await AjaxAsync.WaitJobsAsync();
        await goToNearestTown();

        for (let i = 0; i < 10; i++) {
            bot.CheckAndUse(bot.oldWillowBasket);
            await AjaxAsync.wait(1000);
        }
        EventHandler.signal('inventory_changed');
        await AjaxAsync.wait(2000);

        let poncho = Bag.getItemByItemId(40235000);
        if (poncho) {
            notify(`Закончил, добыл ${poncho.count} пончо!`);
            while (!Player.emailValid) {
                await AjaxAsync.wait(10000);
            }
        }

        await AjaxAsync.WaitJobsAsync();
        //await buyChests(Character.upb);
        // боты, просто быстрый костыль для идемпотентности функции
        //if (await isWearing(438000)) await acceptTownInvite();
        await unwear();
        if (Player.emailValid) await allOnMarket(items_to_sell);
        //await waitForMarket();
        //await leaveTown();
        await sellAll();

        const playerNames = [
            "шляхтер",
            "Stradivari",
            "Giovanni Giorgio",
            "Экнеон",
            "Дохтор",
            "Favorite",
            "Прохор Петрович",
            "Svyatovskii",
            "OctoberVeryOwn01",
            "KateS",
            "Паранька",
            "Epson",
            "Oliver S",
        ];
        
        const randomPlayerName = playerNames[Math.floor(Math.random() * playerNames.length)];
        
        resp = await AjaxAsync.remoteCall("building_bank", "transfer", {
            town_id: 653,
            player: randomPlayerName,
            dollar: Character.money,
            purpose: "обмен",
            agree: true
        });

        if (resp.error) {
            notify(resp.error);
        }

        //await checkAndUse(items.speedPowder);
        //await AjaxAsync.wait(2000);
        await goToRandomJob();

        //resp = await AjaxAsync.remoteCall('settings', 'delete', { "password": Character.name + "123qwe" });
        //if (resp.error) return new UserMessage(resp.msg).show();

        let world = Game.gameURL.replace(/\D/g, '');
        window.location.replace(`/#new${world}`);
        //window.location.replace('/');
        new UserMessage("Бай-бай", UserMessage.TYPE_SUCCESS).show();

    };

    const goToNearestTown = async function () {
        let response = await AjaxAsync.get("map", "get_minimap");
        if (response.error) return new UserMessage(response.msg).show();
        var towns = [];
        for (var town in response.towns) if (response.towns[town].member_count && response.towns[town].town_points > 50000) towns.push(response.towns[town]);
        var position = Character.getPosition();
        for (var t = 0; t < towns.length; t++) towns[t].distance = GameMap.calcWayTime(position, towns[t]);
        towns.sort(function (e, t) { return e.distance - t.distance; });
        let nearestTown = towns[0];
        Guidepost.start_walk(nearestTown.town_id, 'town');
        MarketWindow.open(nearestTown.town_id, 10, nearestTown.name);
        MarketWindow.showTab('sell');
    };
    const goToRandomJob = async function () {
        let jobs = (await getJobs()).filter(job => JobList.getJobById(job.id).canDo());
        let rndId = Math.floor(Math.random() * jobs.length);
        let rndJob = jobs[rndId];
        JobWindow.startJob(rndJob.id, rndJob.x, rndJob.y, 15);
        await AjaxAsync.wait(5000);
    };

    function JobPrototype(x, y, id, gid) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.groupid = gid;
    };
    const getJobs = async function () {
        var currentLength = 0;
        var maxLength = 299;
        let index = 0;
        const r = await AjaxAsync.get('map', 'get_minimap');
        var tiles = [];
        var jobs = [];
        for (var jobGroup in r.job_groups) {
            var group = r.job_groups[jobGroup];
            var jobsGroup = JobList.getJobsByGroupId(parseInt(jobGroup));
            for (var tilecoord = 0; tilecoord < group.length; tilecoord++) {
                if (currentLength == 0) tiles[index] = [];
                tiles[index].push([Math.floor(group[tilecoord][0] / GameMap.tileSize), Math.floor(group[tilecoord][1] / GameMap.tileSize)]);
                if (++currentLength == maxLength) {
                    currentLength = 0;
                    index++;
                }
                for (var i = 0; i < jobsGroup.length; i++) jobs.push(new JobPrototype(group[tilecoord][0], group[tilecoord][1], jobsGroup[i].id, jobsGroup[i].groupid));
            }
        }

        return jobs;
    }



    bot = {
        orange: 13706000,
        whiskey: 13704000,
        tea: 1890000,
        whiskey20years: 1969000,
        trubkaMira: 1971000,
        regenMedal: 21341000,
        harvest2024: 54038000,

        soapWater: 2268000,
        limonad: 52136000,
        led50: 52286000,
        gogolMogol: 52288000,
        cookieEnergy100: 52291000,
        homeEnergyMotiv100: 52292000,
        puding: 52287000, // motive + 75 energy +60
        cake100: 52285000, // motive + 100
        shpinat: 17028000, // motive + 100
        obl40: 2393000,
        obl50: 2137000,
        obl90: 2394000,
        obl100: 2138000,
        obl200: 2395000,
        obl250: 2139000,
        obl550: 2396000,
        incomeMedal: 21343000,
        autoMedal: 21342000,
        regenMedal: 21341000,
        snow2023: 53789000,
        oldWillowBasket: 53350000,
        magicBluePoil40: 50846000,
        valentineCake40: 52361000,
        valentineBox100Motiv45: 52362000,
        slivCake100Motiv100: 52285000,
        heal75: 2117000,
        heal25: 2116000,
        maerChest: 2535000,
        presidentChest: 2533000,
        marshalChest: 17003000,
        generalChest: 17002000,
        captainChest: 17001000,
        simpleChest:  17000000,
        beginnerBag01: 2329000,
        beginnerBag02: 2330000,
        friendBag: 13711000,
        uncleParcel: 2152000,
        fish: 53503000,
        bag2021: 52744000,
        bag2022: 53117000,
        bag2023: 53582000,
        itemsToBuyCache: {},
 
        buyChests: async function(upb) {
            if (upb < 100) return;
            let buyItemId;
            //if (upb >= 450) buyItemId = bot.marshalChest;
            //if (upb >= 500) buyItemId = bot.presidentChest;
            //else buyItemId = bot.captainChest;
            buyItemId = bot.captainChest;
            let response = await AjaxAsync.remoteCall("shop_trader", "buy", {
                item_id: buyItemId,
                category: 'chests',
                currency: 1
            });

            await AjaxAsync.wait(2200);

            if (!response.error) await bot.buyChests(response.bonds);
        },
       
        useItem: async function (itemId) {
            console.log('Хочу подбухнуть ' + itemId);
            let response = await AjaxAsync.remoteCall("itemuse", "use_item", {
                item_id: itemId,
                lastInvId: Bag.getLastInvId()
            });
            if (response.error) return;
            bot.itemCooldown = Math.ceil(response.msg.cooldown * 1000);
            if (Character.cooldown != response.msg.cooldown) {
                Character.cooldown = response.msg.cooldown;
                EventHandler.signal("cooldown_changed");
            }
            if (response.msg.itemCooldown) {
                Bag.itemCooldown[itemId] = response.msg.itemCooldown;
                EventHandler.signal("cooldown_changed");
            }
            if (response.msg.itemLifetime) {
                EventHandler.signal('item_lifetime_changed', [itemId, response.msg.itemLifetime]);
            }
            Bag.updateChanges(response.msg.changes || {});            
        },
        CheckAndUse: function (id) {
            if (Bag.getItemByItemId(id)) { 
                bot.useItem(id);
                return true;
            }

            return false;
        },
        lvl: 6,
        checkCharacter: async function () {

            var missedHealthPercents = bot.getMissedHealth();
            if (missedHealthPercents >= 80) {
                if (Bag.getItemByItemId(bot.heal75)) {
                    bot.useItem(bot.heal75);
                    return;
                }
                if (Bag.getItemByItemId(bot.heal25)) {
                    bot.useItem(bot.heal25);
                    return;
                }
            }
            
            if (!(await bot.needEnergy)) return;
            let fullEnergyBuff =            
                Bag.getItemByItemId(bot.gogolMogol) ||
                Bag.getItemByItemId(bot.trubkaMira) ||
                Bag.getItemByItemId(bot.limonad) ||
                Bag.getItemByItemId(bot.mate100) ||
                Bag.getItemByItemId(bot.cake100) ||
                Bag.getItemByItemId(bot.valentineBox100Motiv45) ||
                Bag.getItemByItemId(bot.homeEnergyMotiv100) ||
                Bag.getItemByItemId(bot.slivCake100Motiv100) ||
                Bag.getItemByItemId(bot.shpinat) || 
                Bag.getItemByItemId(bot.cookieEnergy100);
                // если есть баф на полную энку и энка кончится за 10 мин после употребления бафа - не восполнять
            var missedEnergyPercents = bot.getMissedEnergy();
            
            if (missedEnergyPercents >= 99 && fullEnergyBuff && fullEnergyBuff.obj) {
                    bot.useItem(fullEnergyBuff.obj.item_id);
                    return;
            }
            if (missedEnergyPercents >= 50) {
                let energyBuff = Bag.getItemByItemId(bot.guarana) ||                
                Bag.getItemByItemId(bot.led50) ||
                Bag.getItemByItemId(bot.valentineCake40) ||
                Bag.getItemByItemId(bot.magicBluePoil40) ||
                Bag.getItemByItemId(bot.puding);
                if (energyBuff && energyBuff.obj) {
                    bot.useItem(energyBuff.obj.item_id);
                    return;
                }
            }
            if (missedEnergyPercents >= 20 && ((Character.energy + 20) > 40) || !fullEnergyBuff) {
                let energyBuff =
                    Bag.getItemByItemId(bot.whiskey20years) ||
                    Bag.getItemByItemId(bot.coffee) ||
                    Bag.getItemByItemId(bot.tea);

                if (energyBuff && energyBuff.obj) {
                    bot.useItem(energyBuff.obj.item_id);
                    return
                }
            }
            if (missedEnergyPercents >= 15 && ((Character.energy + 15) > 40) || !fullEnergyBuff) {
                let energyBuff =
                    Bag.getItemByItemId(bot.whiskey);

                if (energyBuff && energyBuff.obj) {
                    bot.useItem(energyBuff.obj.item_id);
                    return
                }
            }
            if (missedEnergyPercents >= 10 && ((Character.energy + 10) > 40) || !fullEnergyBuff) {
                let energyBuff =
                    Bag.getItemByItemId(bot.orange);

                if (energyBuff && energyBuff.obj) {
                    bot.useItem(energyBuff.obj.item_id);
                    return
                }
            }

            if (!fullEnergyBuff && Character.energy == 0 && Character.upb < 36) bot.theEnd();
        },
        needEnergy: async function() {
            let energy = Character.energy;
            let expToLvlUp = Character.getMaxExperience() - Character.experience;
            let job = Araris.addedJobs[Araris.currentJob.job];
            let jobInfo = await AjaxAsync.remoteCallMode('job', 'job', {jobId: job.id, x: job.x, y: job.y});
            let expPerJob = jobInfo.durations[0].xp;
            let motivation = jobInfo.motivation * 100;

            return expToLvlUp > bot.calcExpFromJob(expPerJob, motivation, energy);
        },
        calcExpFromJob: function(expPerJob, motivation, energy) {

            let fullExp = expPerJob / Math.ceil(motivation/25) * 4;

            let sumExp = 0;
            while (motivation > 0 && energy > 0) {
                let jobsCount = Math.min(energy, motivation - Math.floor((motivation - 1)/25) * 25);
                sumExp += Math.round(fullExp / 4 * Math.ceil(motivation/25)) * jobsCount;  
                motivation -= jobsCount;
                energy -= jobsCount;
            }

            return sumExp;
        },
        isLast: false,
        openItemsAndUseBuffs: function () {
            setInterval(async function () {
                if (bot.CheckAndUse(bot.harvest2024) && bot.isLast && Araris.isRunning) {
                    Araris.tryOpen();
                    Araris.tryOpen();
                    Araris.tryOpen();
                    bot.theEnd();
                    Araris.sendTgNotification(`[${Game.worldName}] ${Character.name} закончил сбор мешков!`);
                }
                if (!bot.isLast && Character?.tracking?.current == 99) bot.isLast = true;

                // bot.CheckAndUse(bot.oldWillowBasket);
                bot.CheckAndUse(bot.obl40);
                // bot.CheckAndUse(bot.obl50);
                bot.CheckAndUse(bot.obl90);
                //bot.CheckAndUse(bot.obl100);
                bot.CheckAndUse(bot.obl200);
                //bot.CheckAndUse(bot.obl250);
                bot.CheckAndUse(bot.obl550);
                bot.CheckAndUse(bot.incomeMedal);
                bot.CheckAndUse(bot.autoMedal);
                bot.CheckAndUse(bot.regenMedal);
                // bot.CheckAndUse(bot.uncleParcel);
                bot.CheckAndUse(bot.fish);
                if (BuffList.character == null) {
                    bot.CheckAndUse(bot.ratatui);

                }
                
                if (BuffList.character == null && Character.upb > 38 && !Bag.getItemByItemId(bot.ratatui)) {
                        await AjaxAsync.remoteCall("shop_trader", "buy", {
                                item_id: bot.ratatui,
                                category: 'useables',
                        currency: 1
                    });
                    EventHandler.signal('inventory_changed');
                }
                if (!Bag.getItemByItemId(bot.limonad) && Character.upb >= 15) {
                    await AjaxAsync.remoteCall("shop_trader", "buy", {
                        item_id: bot.limonad,
                        category: 'harvest',
                        currency: 1
                    });
                    EventHandler.signal('inventory_changed');
                }


                // if (!Bag.getItemByItemId(bot.mate100) && Character.upb >= 36) {
                //     let json = await AjaxAsync.remoteCall("shop_trader", "buy", {
                //         item_id: bot.mate100,
                //         category: 'chests',
                //         currency: 1
                //     });
                //     EventHandler.signal('inventory_changed');
                // }

                if (Date.now() > bot.itemCooldown && Date.now() > Character.cooldown * 1000) {
                    await bot.checkCharacter();
                }
                if (Araris.isTwin) {
                    Araris.tryOpen();
                }
            }, 20000);
        },

        getMissedEnergy: function () {
            return 100 - Character.energy / Character.maxEnergy * 100;
        },

        getMissedHealth: function () {
            return 100 - Character.health / Character.maxHealth * 100;
        },


        startToScanMarket: function (pattern) {
            setInterval(function () {
                console.log('start scan with pattern: ' + pattern);
                bot.scanMarket(pattern);
            }, 7000);
        },
        startToScanMarketByDistance: function (pattern) {
            setInterval(function () {
                console.log('start scan by distance');
                bot.scanMarketByDistance(pattern);
            }, 3000);
        },
        scanMarket: async function (searchPattern) {
            let data = await AjaxAsync.remoteCall("building_market", "search", {
                pattern: searchPattern,
                nav: "first",
                page: 1,
                sort: "buynow",
                order: "asc", // from low to high
                level_range_min: 0,
                usable: true,
                has_effect: false,
                visibility: 2 // world
            });

            if (data.error || !data.msg.search_result.length) {
                console.error("scanMarket error: " + data.msg);
                return;
            }

            console.log(data.msg.search_result)
            data.msg.search_result
                .filter(function (searchResultItem) {
                    return searchResultItem.description == Araris.settings.marketDescription
                        && bot.getMaxItemPrice(searchResultItem.item_id) >= (searchResultItem.max_price / searchResultItem.item_count)
                })
                .forEach(function (searchResultItem) {
                    console.log("Buying ", searchResultItem);
                    bot.buyItem(searchResultItem.market_offer_id, searchResultItem.max_price);
                })
            
        },
        scanMarketByDistance: async function (searchPattern) {
            let data = await AjaxAsync.remoteCall("building_market", "search", {
                nav: "first",
                page: 1,
                sort: "distance",
                order: "desc", // from high to low
                level_range_min: 0,
                usable: true,
                has_effect: false,
                visibility: 2 // world
            });

            if (data.error || !data.msg.search_result.length) {
                console.error("scanMarket error: " + data.msg);
                return;
            }

            console.log(data.msg.search_result)
            data.msg.search_result
                .filter(function (searchResultItem) {
                    return searchResultItem.description == Araris.settings.marketDescription
                        && bot.getMaxItemPrice(searchResultItem.item_id) >= (searchResultItem.max_price / searchResultItem.item_count)
                })
                .forEach(function (searchResultItem) {
                    console.log("Buying ", searchResultItem);
                    bot.buyItem(searchResultItem.market_offer_id, searchResultItem.max_price);
                })
            
        },
        getMaxItemPrice: function (itemId) {
            var itemPrice = bot.itemsToBuyCache[itemId];
            if (itemPrice == null) {
                itemPrice = ItemManager.get(itemId).price;
                if (!itemPrice || itemPrice < 1000) itemPrice = 1000;
                bot.itemsToBuyCache[itemId] = itemPrice;
            }

            return itemPrice;
        },
        buyItem: async function (offerId, price) {
            let data = await AjaxAsync.remoteCall("building_market", "bid", {
                bidtype: 0, // by cash
                bid: price,
                market_offer_id: offerId
            });
            if (data.error == false && data.msg.instantBuy) console.log("Item was bought!");
            else console.error("putMoney error: " + data.msg);
        }
    }




    Introduction.createMenuIcons = function () {
        if (Character.level <= 4) {
            let div = $('<div class="ui_menucontainer" id="intro-tutorial" />');
            let link = $('<div id="Menu" class="menulink" onclick=Introduction.DoMain(); title="Introduction" />')
                .css('background-image', 'url(https://westru.innogamescdn.com/images/window/character/buff_greenhorn.png)')
                .css('background-size', 'contain');
            $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
        }
        if (Character.level <= 6) {
            let link = $('<div id="Menu" class="menulink" onclick=Introduction.doItPremium(); title="Introduction with premium" />')
                .css('background-image', 'url(https://westru.innogamescdn.com/images/items/yield/3days_money_bonus.png)')
                .css('background-size', 'contain');
            let div = $('<div class="ui_menucontainer" id="intro-premium" />');
            $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
        }
        if (Character.level < 50) {
            let div = $('<div class="ui_menucontainer" id="stop-sell-all" />');
            var menuimageStop = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWklEQVR4nO3SyyuEURjH8eO6YqHI3kpZ2FJnzFCMJqYsNAtFVga5TC5DLjOliRJh0oxImWzJ7Ni7FBsxRWkWio1/wGXz1dshzULvbWY3Tz11Tue8v8/pnFeIfNkpHCKMQ6DTK7kMxxJiMhxTiMVwDCE2w9FFshCO1vrAYjesD0FbGcSDfz0swVsNW+Mw2a72rg6otZAPmgoMABNueLqFZByOtxX2/Aj7Yeitg9QV7MxC+g5GXfCahmhAfaPt1QX66+HtBSJ94CxUp7y/UGHNJfD5Dq5iSERgd14B/kY4T8LGiAHAUwH+Brg+g8PlTKClFL4+wFkEB0uwt6CA1CWcxMBdbgCY61KBR1E4TWQC2vjhRl2RdiWBVgX01Jp85BkvbI5BR6Warw2Cr0aNfx95yqPmsWnorDIJ5Ow3lSJoG5Ai9C9gG5E64bYQaTDcEiJNhptCpMXwfImf+ga9AK9iq/J/egAAAABJRU5ErkJggg==';
            var linkStop = $('<div id="Menu" class="menulink" onclick=Introduction.theEnd(); title="Закруглиться" />')
                .css('background-image', 'url(' + menuimageStop + ')')
                .css('background-size', 'contain');
            $('#ui_menubar').append((div).append(linkStop).append('<div class="menucontainer_bottom" />'));
        }

        let div = $('<div class="ui_menucontainer" id="intro-all" />');
        let link = $('<div id="Menu" class="menulink" onclick=Introduction.doItAll(); title="Full Introduction" />')
            .css('background-image', 'url(https://westru.innogamescdn.com/images/items/animal/young_stallion.png)')
            .css('background-size', 'contain');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));

        div = $('<div class="ui_menucontainer" id="exp" />');
        link = $('<div id="Menu" class="menulink" onclick=Introduction.DoLvlUp(150);; title="Farm lvl" />')
            .css('background-image', 'url(https://ru11.the-west.ru.com/images/icons/star.png)')
            .css('background-size', 'contain');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));

        div = $('<div class="ui_menucontainer" id="lucile" />');
        link = $('<div id="Menu" class="menulink" onclick=Introduction.DoLucile(); title="Farm product to lucile" />')
            .css('background-image', 'url(https://westru.innogamescdn.com/images/items/left_arm/lucille_lasso.png)')
            .css('background-size', 'contain');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    }

    $(document).ready(function () {
        try {
            Introduction.createMenuIcons();
            west.character.levelup.newFeatureUnlocked.showInfoForLevel = function (lvl) { }
            Player.protection.showMessage_ = function (type) { };
            Premium.checkForEnergyPremium = function() {}
            Premium.checkForAutomationPremium = function() {}

            setTimeout(function () {
                let bonusBtns = document.getElementsByClassName('collect-btn');
                if (bonusBtns.length > 0) bonusBtns[0].click();
                // if (Character.level < 50) Introduction.DoLucile();
            }, 5000);


        } catch (e) {
            console.log("exception occured");
            console.log(e);
        }
    });
})();
