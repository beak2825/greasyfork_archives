// ==UserScript==
// @name         Kittymatic
// @namespace    http://tampermonkey.net/
// @version      1.0.20 [Internal]
// @description  Kittymatic is an automatic worker script for The West.
// @author       LillaMilla, Ahnorac
// @include https://*.the-west.*/game.php*
// @icon         https://www.deviantart.com/ahnorac/art/Cat-icon-1320190750608450315-991941679
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480718/Kittymatic.user.js
// @updateURL https://update.greasyfork.org/scripts/480718/Kittymatic.meta.js
// ==/UserScript==

(function () {

    function JobPrototype(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.silver = false;
        this.distance = 0;
        this.experience = 0;
        this.money = 0;
        this.motivation = 0;
        this.stopMotivation = 75;
        this.set = -1;
    };
    JobPrototype.prototype = {
        setSilver: function (isSilver) {
            this.silver = isSilver;
        },
        calculateDistance: function () {
            this.distance = Map.calcWayTime({ x: this.x, y: this.y }, Character.position);
        },
        setExperience: function (xp) {
            this.experience = xp;
        },
        setMoney: function (money) {
            this.money = money;
        },
        setMotivation: function (motivation) {
            this.motivation = motivation;
        },
        setStopMotivation: function (stopMotivation) {
            if (stopMotivation < 100)
                this.stopMotivation = stopMotivation;
            else stopMotivation = 75;
        },
        setSet: function (setIndex) {
            this.set = setIndex;
        }
    };
    function ConsumablePrototype(id, image, name) {
        this.id = id;
        this.energy = 0;
        this.motivation = 0;
        this.health = 0;
        this.selected = true;
        this.image = image;
        this.count = 0;
        this.name = name;
    };
    ConsumablePrototype.prototype = {
        setEnergy: function (energy) {
            this.energy = energy;
        },
        setMotivation: function (motivation) {
            this.motivation = motivation;
        },
        setHealth: function (health) {
            this.health = health;
        },
        setSelected: function (select) {
            this.selected = select;
        },
        setCount: function (count) {
            this.count = count;
        }
    };

    Kittymatic = {
        version: 10,
        subversion: 20,
        changelogWindow: null,
        window: null,
        customSetWindow: null,
        jobsLoaded: false,
        markedBig: {},
        allJobs: [],
        allConsumables: [],
        consumableUsed: [],
        consumablesRemoved: [],
        addedJobs: [],
        forts: [],
        homeTown: null,
        jobFilter:
        {
            filterOnlySilver: false,
            filterNoSilver: false,
            filterCenterJobs: false,
            filterShowLargeJobs: false,
            filterJob: ""
        },
        sortJobTableXp: 0,
        sortJobTableDistance: 0,
        sortJobTableMoney: 0,
        sortJobTableName: 0,
        sortJobTableMotivation: 0,
        jobTablePosition: { content: "0px", scrollbar: "0px" },
        addedJobTablePosition: { content: "0px", scrollbar: "0px" },
        consumableTablePosition: { content: "0px", scrollbar: "0px" },
        currentState: 0,
        states: ["idle", "running", "waiting for a consumable cooldown"],
        sets: null,
        customSets: null,
        selectedSet: 0,
        selectedSleepPlace: -2,
        travelSet: -1,
        jobSet: -1,
        healthSet: -1,
        regenerationSet: -1,
        language: "",
        searchKeys: {
            "en_DK": {
                energy: "Energy",
                energyText: "Energy increase:",
                motivation: "Work motivation",
                motivationText: "Work motivation increase:",
                health: "Health point bonus",
                healthText: "Health point bonus:"
            },
            "sk_SK": {
                energy: "Energia",
                energyText: "Zvýšenie energie:",
                motivation: "Pracovnej motivácie",
                motivationText: "Zvýšenie pracovnej motivácie:",
                health: "Bonus bodov zdravia",
                healthText: "Bonus bodov zdravia:"
            },
            "cs_CZ": {
                energy: "Energie",
                energyText: "Zvýšení energie:",
                motivation: "Pracovní motivace",
                motivationText: "Zvýšení pracovní motivace:",
                health: "Bonus zdraví",
                healthText: "Bonus zdraví:"
            },
            "hu_HU": {
                energy: "Energia növekedése:",
                energyText: "Energia növekedése:",
                motivation: "Munka motiváció növelése:",
                motivationText: "Munka motiváció növelése:",
                health: "Életerő bónusz",
                healthText: "Életerő bónusz:"
            },
            "pl_PL": {
                energy: "Wzrost energii:",
                energyText: "Wzrost energii:",
                motivation: "Zwiększenie motywacji do pracy:",
                motivationText: "Zwiększenie motywacji do pracy:",
                health: "Bonus Punktów życia:",
                healthText: "Bonus Punktów życia:"
            },
            "ro_RO": {
                energy: "Energie mărită:",
                energyText: "Energie mărită:",
                motivation: "Creştere a motivaţiei de muncă:",
                motivationText: "Creştere a motivaţiei de muncă:",
                health: "Puncte de viaţă:",
                healthText: "Puncte de viaţă:"
            },


        },
        consumableSelection: { energy: false, motivation: false, health: false },
        isRunning: false,
        currentJob: { job: 0, direction: true },
        jobRunning: false,
        settings: {
            useConsumablesRuntime: true,
            acceptableWaste: 0,
            addEnergy: false,
            addMotivation: false,
            addHealth: false,
            goToBank: false,
            healthStop: 100,
            moneyLimit: 100000,
            setWearDelay: 5,
            jobDelayMin: 0,
            jobDelayMax: 0,
            enableRegeneration: false
        },
        statistics: {
            jobsInSession: 0,
            xpInSession: 0,
            moneyInSession: 0,
            itemsDroppedInSession: 0,
            highestPricedItemInSession: 0,
            moneyFromItemsInSession: 0,
            consumablesUsedInSession: 0,
            totalJobs: 0,
            totalXp: 0,
            totalMoney: 0,
            totalItemsDropped: 0,
            highestPricedItemTotal: 0,
            totalMoneyFromItems: 0,
            totalConsumablesUsed: 0

        },
        loadedTowns: [],
        townsLoaded: false,
        lastLevel: 0,
        jobPoints: {},
        jobPointsLoaded: false,
        Test: {},
        Helper: {},
        Stats: {},
        Changelog: {}
    };

    Kittymatic.Test.deepClone = function (object) {

        if (
            typeof object === 'object' &&
            !Array.isArray(object) &&
            object !== null
        ) {

            var result = {};
            for (var item in object) {
                result[item] = Kittymatic.Test.deepClone(object[item]);
            }
            return result;
        }
        else if (object !== null && Array.isArray(object)) {
            var result = [];
            for (var i = 0; i < object.length; i++)
                result.push(Kittymatic.Test.deepClone(object[i]));
            return result;
        }
        else return object;
    }

    Kittymatic.Helper.getSkillsForItem = function (item_id) {
        var base_id = (item_id - item_id % 1000) / 1000;
        var level = item_id % 1000;

        var item = Kittymatic.Test.deepClone(ItemManager.getByBaseId(base_id, level));
        var bonuses = item.bonus.item;

        var skills = [];

        for (var i = 0; i < bonuses.length; i++) {

            if (bonuses[i].type === "character") {
                skills.push(bonuses[i]);
                if (level > 0) {
                    otherBonus = Kittymatic.Test.deepClone(bonuses[i]);
                    otherBonus.type = "upgrade"
                    otherBonus.bonus.value = level * 0.1 * otherBonus.bonus.value;
                    skills.push(otherBonus);
                }
            }
            else {

                bonuses[i].value = Math.round((bonuses[i].value + bonuses[i].value * level * 0.1) * 100) / 100;
                skills.push(bonuses[i]);

            }
        }
        if (!Array.isArray(item.bonus.skills))
            skills.push({ skills: item.bonus.skills });
        if (!Array.isArray(item.bonus.attributes))
            skills.push({ attributes: item.bonus.attributes });
        return skills;
    }

    Kittymatic.Helper.recalculateSkills = function (item_id, level) {
        var itemSkills = Kittymatic.Helper.getSkillsForItem(item_id);
        var skills = {};

        for (var i = 0; i < itemSkills.length; i++) {
            if (itemSkills[i].skills) {
                for (var k in itemSkills[i].skills) {
                    if (skills[k])
                        skills[k] += itemSkills[i].skills[k];
                    else
                        skills[k] = itemSkills[i].skills[k];
                }
            }
            if (itemSkills[i].attributes) {
                for (var k in itemSkills[i].attributes) {
                    if (skills[k])
                        skills[k] += itemSkills[i].attributes[k];
                    else
                        skills[k] = itemSkills[i].attributes[k];
                }
            }
            if (itemSkills[i].type === "character") {

                if (itemSkills[i].key === "level") {
                    var lvlBonus = Math.ceil(level * itemSkills[i].bonus.value);
                    var key = itemSkills[i].bonus.name;
                    if (itemSkills[i].bonus.type === "skill") {

                    }
                    else if (itemSkills[i].bonus.type === "attribute") {

                    }
                    else {
                        lvlBonus = Math.ceil(level * itemSkills[i].bonus.value * 100) / 100;
                        key = itemSkills[i].bonus.type;
                    }
                    if (skills[key])
                        skills[key] += lvlBonus;
                    else
                        skills[key] = lvlBonus;
                }
                else console.log("Nonlevel");
            }
            else if (itemSkills[i].type === "upgrade") {

                if (itemSkills[i].key === "level") {
                    var lvlBonus = (level * itemSkills[i].bonus.value);
                    if (lvlBonus % 1 < 0.4)
                        lvlBonus -= lvlBonus % 1;
                    else lvlBonus = Math.ceil(lvlBonus);

                    var key = itemSkills[i].bonus.name;
                    if (itemSkills[i].bonus.type === "skill") {
                        if (lvlBonus == 0)
                            lvlBonus = 1;
                    }
                    else if (itemSkills[i].bonus.type === "attribute") {
                        if (lvlBonus == 0)
                            lvlBonus = 1;
                    }
                    else {
                        lvlBonus = Math.ceil(level * itemSkills[i].bonus.value * 100) / 100;
                        key = itemSkills[i].bonus.type;
                    }
                    if (skills[key])
                        skills[key] += lvlBonus;
                    else
                        skills[key] = lvlBonus;
                }
                else console.log("Nonlevel");
            }
            else {
                var key = itemSkills[i].type;
                var lvlBonus = itemSkills[i].value;
                if (itemSkills[i].key && itemSkills[i].key === "level") {
                    lvlBonus = level * lvlBonus;
                    lvlBonus = Math.ceil(lvlBonus * 100) / 100;
                }

                if (skills[key])
                    skills[key] += lvlBonus;
                else
                    skills[key] = lvlBonus;
            }



        }

        return skills;
    }


    Kittymatic.Helper.getCurrentWearIds = function () {
        var arr = [];
        for (var k in Wear.wear) {
            arr.push(Wear.wear[k].obj.item_id);
        }
        return arr;
    }

    Kittymatic.Helper.getSetsForItemArray = function (arr) {
        var names = [];

        for (var i = 0; i < arr.length; i++) {
            var base_id = (arr[i] - arr[i] % 1000) / 1000;
            var item = ItemManager.getByBaseId(base_id, 0);

            if (item.set != null) {
                found = -1;
                for (var j = 0; j < names.length; j++) {
                    if (names[j].set === item.set) {
                        found = j;
                        break;
                    }
                }
                if (found == -1)
                    names.push({ set: item.set, count: 1 });
                else names[found].count++;
            }
        }

        return names;
    }

    Kittymatic.Helper.recalculateSkillsForItemArray = function (arr, level) {
        var skills = {};

        for (var i = 0; i < arr.length; i++) {
            sk = Kittymatic.Helper.recalculateSkills(arr[i], level);
            for (var k in sk) {
                if (skills[k])
                    skills[k] += sk[k];
                else
                    skills[k] = sk[k];
            }

        }

        var sets = Kittymatic.Helper.getSetsForItemArray(arr);
        for (var i = 0; i < sets.length; i++) {
            var bonus = Kittymatic.Helper.getSetBonuses(sets[i].set, sets[i].count, level);

            for (var k in bonus) {
                if (skills[k])
                    skills[k] += bonus[k];
                else
                    skills[k] = bonus[k];
            }
        }



        return skills;
    }

    Kittymatic.Helper.addAttributesToSkills = function (skills) {

        for (var sk in CharacterSkills.skills) {
            for (var attr in skills) {
                if (CharacterSkills.skills[sk].attr_key == attr) {
                    if (skills[sk] != null)
                        skills[sk] += skills[attr];
                    else
                        skills[sk] = skills[attr];
                }
            }
        }
    }

    Kittymatic.Helper.addCharacterSkillsToSkills = function (skills) {
        for (var sk in CharacterSkills.skills) {
            var value = CharacterSkills.skills[sk].points;
            if (skills[sk] != null)
                skills[sk] += value;
            else
                skills[sk] = value;
        }
    }

    Kittymatic.Helper.getSetIdByName = function (name) {
        for (var i = 0; i < Kittymatic.allSets.length; i++) {
            if (Kittymatic.allSets[i].key === name)
                return i;
        }
        return null;
    }

    Kittymatic.Helper.getSetBonuses = function (name, count, level) {
        var id = Kittymatic.Helper.getSetIdByName(name);

        var skills = {};

        if (id != null) {
            for (var i = 2; i <= count; i++) {

                var bonuses = Kittymatic.allSets[id].bonus[i];

                for (var j = 0; j < bonuses.length; j++) {

                    if (bonuses[j].type === "character") {
                        var key = bonuses[j].bonus.name;
                        var value = bonuses[j].bonus.value;
                        if (bonuses[j].key === "level")
                            value = bonuses[j].bonus.value * level;
                        if (skills[key])
                            skills[key] += value;
                        else
                            skills[key] = value;

                    }
                    else {
                        var key = bonuses[j].type;
                        var value = bonuses[j].value;
                        if (bonuses[j].key === "level")
                            value = bonuses[j].value * level;
                        if (skills[key])
                            skills[key] += value;
                        else
                            skills[key] = value;


                    }
                }

            }
        }

        for (var k in skills) {
            if (k === "dollar"
                || k === "drop"
                || k === "experience"
                || k === "luck") {

            }
            else skills[k] = Math.ceil(skills[k]);
        }

        return skills;
    }

    Kittymatic.Helper.fullCalculateSet = function (item_array) {
        var skills = Kittymatic.Helper.recalculateSkillsForItemArray(item_array, Character.level);
        Kittymatic.Helper.addAttributesToSkills(skills);
        Kittymatic.Helper.addCharacterSkillsToSkills(skills);

        if (Character.charClass === "worker") {
            var workerXP = 0.05;
            if (Premium.hasBonus('character')) {
                workerXP = 0.1;
            }
            if (skills.experience)
                skills.experience += workerXP;
            else
                skills["experience"] = workerXP;
        }

        return skills;
    }

    Kittymatic.Helper.getFullBestGear = function (job) {
        var gear = Kittymatic.getBestGear(job);

        for (var k in Wear.wear) {
            var found = false;
            for (var i = 0; i < gear.length; i++) {
                var base_id = (gear[i] - gear[i] % 1000) / 1000;
                var type = ItemManager.getByBaseId(base_id, 0).type;
                if (k === type) {
                    found = true;
                    break;
                }
            }
            if (!found)
                gear.push(Wear.wear[k].obj.item_id);
        }

        return gear;
    }

    Kittymatic.Helper.loadAllWestSets = async function () {
        await Ajax.remoteCallMode('data', 'item_sets', {}, function (json) {
            if (json.error)
                Kittymatic.log("Error in acquiring custom sets!");

            Kittymatic.allSets = json;
        });
        return true;
    }

    Kittymatic.Helper.getSetItems = function (setIndex) {
        var items = [];
        var set = {};
        if (setIndex < 20) {
            set = Kittymatic.sets[setIndex];
        }
        else {
            set = Kittymatic.customSets[setIndex - 20];
        }

        for (var k in set) {
            if (k === "equip_manager_id" || k === "name" || k === "player_id") {

            }
            else items.push(set[k]);
        }
        return items;
    }

    Kittymatic.Helper.GetJobInfo = function (jobId) {
        for (var i = 0; i < libs.KittyJobList.length; i++) {
            if (libs.KittyJobList[i].id == jobId)
                return libs.KittyJobList[i];
        }
        console.log("ISSSUEEEEEEEEEEEEEEEEEEEE!!!!!");
    }

    Kittymatic.Helper.calculateAverageXP = function () {
        var totalXp = 0;

        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            var jobId = Kittymatic.addedJobs[i].id;
            var jobInfo = Kittymatic.Helper.GetJobInfo(jobId);
            var silver = Kittymatic.addedJobs[i].silver;

            var stop = Kittymatic.addedJobs[i].stopMotivation;
            var worstCaseMotivationDebuff = 1;
            if (stop < 25)
                worstCaseMotivationDebuff = 0.25;
            else if (stop < 50)
                worstCaseMotivationDebuff = 0.5;
            else if (stop < 75)
                worstCaseMotivationDebuff = 0.75;


            var setId = Kittymatic.addedJobs[i].set;
            var set = Kittymatic.Helper.getSetItems(setId);
            var skills = Kittymatic.Helper.fullCalculateSet(set);
            var baseXp = jobInfo.baseexp;
            var xpBonus = 0;
            var silverBoost = (silver) ? 1.5 : 1.0;

            if (skills.experience)
                xpBonus = skills.experience;

            var calcedXp = Math.ceil(Math.ceil(Math.ceil((Math.ceil(baseXp) + Math.round(baseXp * xpBonus)) * silverBoost / 10) * worstCaseMotivationDebuff)); //idk, not good all the times

            totalXp += calcedXp;

        }
        totalXp /= Kittymatic.addedJobs.length;
        return totalXp;


    }

    Kittymatic.Helper.calculateBestPointsForJob = function (jobid) {
        var needed = JobList.getJobById(jobid).skills;

        var gear = Kittymatic.Helper.getFullBestGear(jobid);
        var skills = Kittymatic.Helper.fullCalculateSet(gear);

        var points = 0;

        for (var skill in needed) {
            if (skills[skill])
                points += skills[skill] * needed[skill];
        }

        if (skills["job"])
            points += skills["job"];
        return points;
    }

    Kittymatic.Helper.calcAllJobPoints = async function () {
        Kittymatic.log("Kittymatic.Helper.calcAllJobPoints - waiting");
        while (typeof libs === "undefined" || typeof libs.KittyJobList === "undefined") {
            await new Promise(r => setTimeout(r, 25));
        }
        Kittymatic.jobPointsLoaded = false;
        new UserMessage("Calculating best gears, might take a while", UserMessage.TYPE_ERROR).show();
        Kittymatic.log("Kittymatic.Helper.calcAllJobPoints - doing");

        for (var i = 0; i < libs.KittyJobList.length; i++) {
            var id = libs.KittyJobList[i].id;

            var points = Kittymatic.Helper.calculateBestPointsForJob(id);
            Kittymatic.jobPoints[id] = points;
            await new Promise(r => setTimeout(r, 66));

            for (var j = 1; j < 5; j++) {
                var c = Math.ceil(j * 0.20 * libs.KittyJobList.length);

                if (i == c)
                    new UserMessage("Calculating (" + (j * 20) + "%)", UserMessage.TYPE_ERROR).show();
            }

        }
        new UserMessage("Calculated fully!", UserMessage.TYPE_ERROR).show();
        Kittymatic.jobPointsLoaded = true;
        return true;
    }

    Kittymatic.Helper.canDoJob = function (id) {
        return Kittymatic.jobPoints[id] > (JobList.getJobById(id).malus + 1);
    }

    Kittymatic.Helper.checkLevel = function () {
        if (Character.level > Kittymatic.lastLevel) {
            Kittymatic.lastLevel = Character.level;
            Kittymatic.Helper.calcAllJobPoints();
        }
    }

    Kittymatic.Helper.getHealthSetHealth = function () {

        if (Kittymatic.healthSet == null)
            return Character.maxHealth;

        var items = Kittymatic.Helper.getSetItems(Kittymatic.healthSet);
        var skills = Kittymatic.Helper.fullCalculateSet(items);

        var baseHealth = 100 + (Character.level - 1) * 10;

        var healthPerPoints = 10;
        if (Character.charClass === "soldier") {
            healthPerPoints = 15;
            if (Premium.hasBonus('character'))
                healthPerPoints = 20;
        }

        var health = baseHealth;

        if (skills["health"])
            health += skills["health"] * healthPerPoints;

        return health;
    }

    Kittymatic.Helper.getJobSetHealth = function () {
        if (Kittymatic.healthSet == null)
            return Character.maxHealth;

        var items = Kittymatic.Helper.getSetItems(Kittymatic.jobSet);
        var skills = Kittymatic.Helper.fullCalculateSet(items);

        var baseHealth = 100 + (Character.level - 1) * 10;

        var healthPerPoints = 10;
        if (Character.charClass === "soldier") {
            healthPerPoints = 15;
            if (Premium.hasBonus('character'))
                healthPerPoints = 20;
        }

        var health = baseHealth;

        if (skills["health"])
            health += skills["health"] * healthPerPoints;

        return health;
    }

    Kittymatic.Helper.getHealthPercent = function () {
        var normalHealth = 0, healthSetHealth = Kittymatic.Helper.getHealthSetHealth();
        normalHealth = Kittymatic.Helper.getJobSetHealth();

        return (normalHealth / healthSetHealth) * 100;
    }

    Kittymatic.Helper.getMissingHealthPercent = function () {
        var normalHealth = 0, healthSetHealth = Kittymatic.Helper.getHealthSetHealth();
        normalHealth = Kittymatic.Helper.getJobSetHealth();

        var currentHealthPercentage = Character.health / healthSetHealth;
        var healthMaxPercentage = normalHealth / healthSetHealth;

        return (healthMaxPercentage - currentHealthPercentage) * 100;
    }

    Kittymatic.Helper.calculateMoneyForJob = function (job) {
        var jobId = job.id;
        var jobInfo = Kittymatic.Helper.GetJobInfo(jobId);
        var silver = job.silver;
        var extra_points = Kittymatic.jobPoints[jobId] - (JobList.getJobById(jobId).malus + 1);

        var items = Kittymatic.Helper.getCurrentWearIds();
        var skills = Kittymatic.Helper.fullCalculateSet(items);
        var money = 0;
        if (skills.dollar)
            money = skills.dollar;

        var moneyMultiplier = Math.pow(extra_points, 0.05);

        var calcedMoney = (jobInfo.basemoney * moneyMultiplier) * (1 + money);
        if (silver)
            calcedMoney *= 1.5;
        if (Premium.hasBonus("money"))
            calcedMoney *= 1.5;

        if (job.motivation <= 25)
            calcedMoney *= 0.25;
        else if (job.motivation <= 50)
            calcedMoney *= 0.5;
        else if (job.motivation <= 75)
            calcedMoney *= 0.75;

        calcedMoney = Math.round(calcedMoney);
        calcedMoney = Math.ceil(calcedMoney / 10);

        return calcedMoney;
    }

    Kittymatic.Helper.calculateExpForJob = function (job) {
        var jobId = job.id;
        var jobInfo = Kittymatic.Helper.GetJobInfo(jobId);
        var silver = job.silver;

        var items = Kittymatic.Helper.getCurrentWearIds();
        var skills = Kittymatic.Helper.fullCalculateSet(items);
        var exp = 0;
        if (skills.experience)
            exp = skills.experience;


        var calcedExp = (jobInfo.baseexp) * (1 + exp);
        if (silver)
            calcedExp *= 1.5;

        if (job.motivation <= 25)
            calcedExp *= 0.25;
        else if (job.motivation <= 50)
            calcedExp *= 0.5;
        else if (job.motivation <= 75)
            calcedExp *= 0.75;

        calcedExp = Math.round(calcedExp);
        calcedExp = Math.ceil(calcedExp / 10);

        return calcedExp;
    }

    Kittymatic.Stats.onHandleChanges = function (changes) {
        if (!Kittymatic.isRunning)
            return;
        Kittymatic.log("Kittymatic.onHandleChanges");
        var changed = false;
        for (var i = 0; i < changes.length; i++) {
            var item = Bag.getItemByItemId(changes[i].item_id);
            var newCount = changes[i].count;
            var oldCount = 0;
            var sell_price, dropable;
            if (!item) {


                var base_id = (changes[i].item_id - changes[i].item_id % 1000) / 1000;

                sell_price = ItemManager.getByBaseId(base_id).sell_price;
                dropable = ItemManager.getByBaseId(base_id).dropable;
            }
            else {
                oldCount = item.count;
                sell_price = item.obj.sell_price;
                dropable = item.obj.dropable;
            }

            if (oldCount < newCount && dropable) {
                Kittymatic.statistics.moneyFromItemsInSession += sell_price;
                Kittymatic.statistics.totalMoneyFromItems += sell_price;
                Kittymatic.statistics.itemsDroppedInSession++;
                Kittymatic.statistics.totalItemsDropped++;

                if (sell_price > Kittymatic.statistics.highestPricedItemInSession)
                    Kittymatic.statistics.highestPricedItemInSession = sell_price;
                if (sell_price > Kittymatic.statistics.highestPricedItemTotal)
                    Kittymatic.statistics.highestPricedItemTotal = sell_price;

                changed = true;
            }
        }

        if (changed)
            Kittymatic.setStatisticsInStorage();
    }

    Kittymatic.Stats.hookHandleChanges = function () {
        Kittymatic.log("Kittymatic.hookHandleChanges");
        Bag.handleChanges = function (changes, from) {
            if (typeof from === "undefined" || from == undefined)
                Kittymatic.Stats.onHandleChanges(changes);
            var i = 0, l = changes.length, item;
            for (i; i < l; i++) {
                item = this.getItemByItemId(changes[i].item_id);
                if (!item && changes[i].count > 0) {
                    this.addItem(this.createBagItem(changes[i]), from);
                } else {
                    this.removeItem(changes[i], from);
                }
            }
            Inventory.update();
        };
    }

    Kittymatic.Stats.resetStats = function () {
        Kittymatic.log("Kittymatic.resetStats");
        Kittymatic.statistics = {
            jobsInSession: 0,
            xpInSession: 0,
            moneyInSession: 0,
            itemsDroppedInSession: 0,
            moneyFromItemsInSession: 0,
            consumablesUsedInSession: 0,
            totalJobs: 0,
            totalXp: 0,
            totalMoney: 0,
            totalItemsDropped: 0,
            totalMoneyFromItems: 0,
            totalConsumablesUsed: 0

        };
    }

    Kittymatic.Stats.updateXP = function (oldXp) {
        var xpDifference = Character.experience - oldXp;
        Kittymatic.statistics.xpInSession += xpDifference;
        Kittymatic.statistics.totalXp += xpDifference;
    }

    Kittymatic.Stats.updateMoney = function (oldMoney) {
        if (Character.money < oldMoney)
            return;
        var moneyDifference = Character.money - oldMoney;
        Kittymatic.statistics.moneyInSession += moneyDifference;
        Kittymatic.statistics.totalMoney += moneyDifference;
    }

    Kittymatic.log = function (message) {
        date = new Date();
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();
        timeFormat = "[" + ((hours < 10) ? "0" : "") + hours + ":" + ((minutes < 10) ? "0" : "") + minutes + ":" + ((seconds < 10) ? "0" : "") + seconds + "] ";
        console.log(timeFormat + message);
    }
    Kittymatic.isNumber = function (potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber));
    };

    Kittymatic.generateRandomNumber = function (min, max) {
        var minN = Math.min(min, max);
        var maxN = Math.max(min, max);

        var number = Math.floor((minN + Math.random() * (maxN - minN + 1)));
        Kittymatic.log("Generated job set delay is :" + number + " seconds");
        return number;
    }

    Kittymatic.loadTowns = function (page) {
        n = page * 9 + 1;
        Ajax.remoteCallMode('ranking', 'get_data', {
            rank: n.toString(),
            search: "",
            tab: "cities"
        }).then(json => {
            if (json.ranking) {
                Kittymatic.loadedTowns.push(json);
                Kittymatic.loadTowns(page + 1);
            }
            else {
                Kittymatic.townsLoaded = true;
            }
        })
    }

    Kittymatic.requireFiles = function () {
        //array to hold the external libabry paths
        var jsLibs = new Array();
        jsLibs[0] = "https://update.greasyfork.org/scripts/481193/1293592/Kittymatic%20Job%20Library.js";

        var index = 0;
        var requireNext = function () {
            var script = document.createElement("script");
            if (index < jsLibs.length) {
                script.addEventListener("load", requireNext, false);
                script.setAttribute("src", jsLibs[index++]);
            }
            document.body.appendChild(script);
        }
        requireNext();
    }

    Kittymatic.goToTown = async function () {
        Kittymatic.log("Kittymatic.goToTown");
        townPos = { x: Character.homeTown.x, y: Character.homeTown.y };
        townIndex = Character.homeTown.town_id;
        townData = { id: townIndex, pos: townPos }
        if (townIndex == 0)
            townData = Kittymatic.findClosestTown();

        var equiped = await Kittymatic.equipSet(Kittymatic.travelSet);
        Guidepost.start_walk(townData.id, 'town');


        while (true) {
            await new Promise(r => setTimeout(r, 10));
            if (Map.calcWayTime(Character.position, townData.pos) == 0)
                break;
        }
        Kittymatic.putMoneyToBank(townData.id);
        Kittymatic.run();
    }

    Kittymatic.isMoneyAboveLimit = function () {
        if (Kittymatic.settings.moneyLimit <= 0)
            return false;
        return Character.money >= Kittymatic.settings.moneyLimit;
    }

    Kittymatic.putMoneyToBank = async function (town_id) {
        var amount = Character.money;
        Ajax.remoteCall("building_bank", "deposit", {
            town_id: town_id,
            amount: amount
        }, function (data) {
            if (data.error == false) {
                BankWindow.Balance.Mupdate(data);
                Character.setDeposit(data.deposit);
                Character.setMoney(data.own_money);
                new UserMessage(s(sextext('$ %1 -> bank (- $ %2 )', '$ %1 -> bank (- $ %2 )', Character.charSex), amount, data.fee), UserMessage.TYPE_SUCCESS).show();
            } else
                new UserMessage(data.msg, UserMessage.TYPE_ERROR).show();
        }, BankWindow);
    }


    Kittymatic.findClosestTown = function () {
        if (!Kittymatic.townsLoaded || Kittymatic.loadedTowns.length == 0) {
            console.log("Could not find town");
            return {
                id: 4497, pos: { x: 44056, y: 17479 }
            };

        }
        closestIndex = Kittymatic.loadedTowns[0].ranking[0].town_id;
        closestPosition = { x: Kittymatic.loadedTowns[0].ranking[0].town_x, y: Kittymatic.loadedTowns[0].ranking[0].town_y };
        closestDistance = Map.calcWayTime(Character.position, closestPosition);
        for (var i = 0; i < Kittymatic.loadedTowns.length; i++) {
            for (var j = 0; j < Kittymatic.loadedTowns[i].ranking.length; j++) {
                pos = { x: Kittymatic.loadedTowns[i].ranking[j].town_x, y: Kittymatic.loadedTowns[i].ranking[j].town_y };
                currentDist = Map.calcWayTime(Character.position, pos);
                if (currentDist < closestDistance) {
                    closestDistance = currentDist;
                    closestIndex = Kittymatic.loadedTowns[i].ranking[j].town_id;
                    closestPosition = pos;
                }
            }
        }
        return { id: closestIndex, pos: closestPosition };
    }

    Kittymatic.loadJobs = function () {

        if (!Kittymatic.townsLoaded) {
            Kittymatic.loadTowns(0);
        }


        if (!Kittymatic.jobsLoaded) {
            new UserMessage("Loading...", UserMessage.TYPE_HINT).show();
            var tiles = [];
            var index = 0;
            var currentLength = 0;
            var maxLength = 299;
            Ajax.get('map', 'get_minimap', {}, function (r) {
                var tiles = [];
                var jobs = [];

                for (var townNumber in r.towns) {
                    if (r.towns[townNumber].town_id == Character.homeTown.town_id) {
                        Kittymatic.homeTown = r.towns[townNumber];
                        break;
                    }
                }

                /*for(var fortNumber in r.forts) {
                    for(var fortNumber2 in r.forts[fortNumber]) {
                        var fort = r.forts[fortNumber][fortNumber2];
                        if(fort['fort']['alliance_id'] == Character.homeTown.alliance_id) {
                           Kittymatic.forts.push(fort['fort']);
                        }
                    }
                }*/

                for (var jobGroup in r.job_groups) {
                    var group = r.job_groups[jobGroup];
                    var jobsGroup = JobList.getJobsByGroupId(parseInt(jobGroup));
                    for (var tilecoord = 0; tilecoord < group.length; tilecoord++) {
                        var xCoord = Math.floor(group[tilecoord][0] / Map.tileSize);
                        var yCoord = Math.floor(group[tilecoord][1] / Map.tileSize);
                        if (currentLength == 0) {
                            tiles[index] = [];
                        }
                        tiles[index].push([xCoord, yCoord]);
                        currentLength++;
                        if (currentLength == maxLength) {
                            currentLength = 0;
                            index++;
                        }
                        for (var i = 0; i < jobsGroup.length; i++) {
                            jobs.push(new JobPrototype(group[tilecoord][0], group[tilecoord][1], jobsGroup[i].id));
                        }
                    }
                }
                var toLoad = tiles.length;
                var loaded = 0;
                for (var blocks = 0; blocks < tiles.length; blocks++) {
                    Map.Data.Loader.load(tiles[blocks], function () {
                        loaded++;
                        if (loaded == toLoad) {
                            Kittymatic.jobsLoaded = true;
                            Kittymatic.allJobs = jobs;
                            Kittymatic.findAllConsumables();
                            Kittymatic.createWindow();
                        }
                    });
                }
            });
        } else {
            Kittymatic.findAllConsumables();
            Kittymatic.createWindow();
        }
    };
    Kittymatic.loadJobData = function (callback) {
        Ajax.get('work', 'index', {}, function (r) {
            if (r.error) {
                console.log(r.error);
                return;
            }
            JobsModel.initJobs(r.jobs);
            callback();
        });
    };
    Kittymatic.loadSets = function (callback) {
        Ajax.remoteCallMode('inventory', 'show_equip', {}, function (r) {
            Kittymatic.sets = [];
            for (var i = r.data.length - 1; i >= 0; i--)
                Kittymatic.sets.push(r.data[i]);
            callback();
        });
    };
    Kittymatic.loadLanguage = function () {
        Ajax.remoteCall("settings", "settings", {}, function (resp) {
            Kittymatic.language = resp.lang.account.key;
        });
    };
    Kittymatic.loadJobMotivation = async function (index, callback) {
        Ajax.get('job', 'job', { jobId: Kittymatic.addedJobs[index].id, x: Kittymatic.addedJobs[index].x, y: Kittymatic.addedJobs[index].y }, function (r) {
            callback(r.motivation * 100);
        });
    };
    Kittymatic.getJobName = function (id) {
        return JobList.getJobById(id).name;
    };


    Kittymatic.getJobIcon = function (silver, id, x, y) {
        var html = '<div class="centermap" onclick="Map.center(' + x + ',' + y + ');"style="position: absolute;background-image: url(\'../images/map/icons/instantwork.png\');width: 20px;height: 20px;top: 0;right: 3px;cursor: pointer;"></div>';
        var silverHtml = "";
        if (silver) {
            silverHtml = '<div class="featured silver" onclick="JobWindow.open(' + id + ',' + x + ',' + y + ')"></div>';
        }
        return '<div class="job" style="left: 0; top: 0; position: relative;"><div  onclick="JobWindow.open(' + id + ',' + x + ',' + y + ')" class="featured"></div>' + silverHtml + html + '<img src="../images/jobs/' + JobList.getJobById(id).shortname + '.png" class="job_icon"></div>';
    };
    Kittymatic.getConsumableIcon = function (src) {
        return "<div><img src =" + src + "></div>";
    };
    Kittymatic.checkIfSilver = function (x, y, id) {
        var key = x + "-" + y;
        var jobData = Map.JobHandler.Featured[key];
        if (jobData == undefined || jobData[id] == undefined) {
            return false;
        } else {
            return jobData[id].silver;
        }
    };
    Kittymatic.compareUniqueJobs = function (job, jobs) {
        for (var i = 0; i < jobs.length; i++) {
            if (jobs[i].id == job.id) {
                if (job.silver && !jobs[i].silver || (job.silver == jobs[i].silver && job.distance < jobs[i].distance)) {
                    jobs.splice(i, 1);
                    jobs.push(job);
                }
                return;
            }
        }
        jobs.push(job);
    };
    Kittymatic.findJobData = function (job) {
        for (var i = 0; i < JobsModel.Jobs.length; i++) {
            if (JobsModel.Jobs[i].id == job.id) {
                return JobsModel.Jobs[i];
            }
        }
    };
    Kittymatic.parseJobData = function (jobs) {
        for (var job = 0; job < jobs.length; job++) {
            var currentJob = jobs[job];
            var data = Kittymatic.findJobData(currentJob);
            currentJob.setMotivation(data.jobmotivation * 100);
            var xp = Kittymatic.Helper.calculateExpForJob(currentJob);
            var money = Kittymatic.Helper.calculateMoneyForJob(currentJob);
            if (currentJob.silver) {
                //xp = Math.ceil(1.5 * xp);
                //money = Math.ceil(1.5 * money);
            }
            currentJob.setExperience(xp);
            currentJob.setMoney(money);

        }
    };
    Kittymatic.updateJobDistances = function () {
        for (var i = 0; i < Kittymatic.allJobs.length; i++) {
            Kittymatic.allJobs[i].calculateDistance();
        }
    };
    Kittymatic.getAllUniqueJobs = function () {
        Kittymatic.updateJobDistances();
        var jobs = [];
        for (var i = 0; i < Kittymatic.allJobs.length; i++) {
            var currentJob = Kittymatic.allJobs[i];
            if (Kittymatic.jobFilter.filterJob != "") {
                if (!Kittymatic.getJobName(currentJob.id).toLowerCase().includes(Kittymatic.jobFilter.filterJob.toLowerCase())) {
                    continue;
                }
            }
            Kittymatic.markedBig["x-" + currentJob.x + "y-" + currentJob.y + "id-" + currentJob.id] = false;
            if (!JobList.getJobById(currentJob.id).canDo()) {
                if (Kittymatic.jobFilter.filterShowLargeJobs && Kittymatic.Helper.canDoJob(Kittymatic.allJobs[i].id)) {
                    Kittymatic.markedBig["x-" + currentJob.x + "y-" + currentJob.y + "id-" + currentJob.id] = true;
                }
                else
                    continue;
            }

            if (Kittymatic.checkIfJobAdded(currentJob.id)) {
                continue;
            }
            var isSilver = Kittymatic.checkIfSilver(currentJob.x, currentJob.y, currentJob.id);
            currentJob.silver = isSilver;
            currentJob.calculateDistance();
            if (isSilver && Kittymatic.jobFilter.filterNoSilver) {
                continue;
            }
            if (!isSilver && Kittymatic.jobFilter.filterOnlySilver) {
                continue;
            }
            if (Kittymatic.jobFilter.filterCenterJobs && currentJob.id < 131) {
                continue;
            }
            Kittymatic.compareUniqueJobs(currentJob, jobs);
        }
        Kittymatic.parseJobData(jobs);

        var experienceSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return 1;
            }
            if (a != null && b == null) {
                return -1;
            }
            var a1 = a.experience;
            var b1 = b.experience;
            return (a1 > b1) ? -1 : (a1 < b1) ? 1 : 0;
        };
        var reverseExperienceSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return -1;
            }
            if (a != null && b == null) {
                return 1;
            }
            var a1 = a.experience;
            var b1 = b.experience;
            return (a1 > b1) ? 1 : (a1 < b1) ? -1 : 0;
        };
        var distanceSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return 1;
            }
            if (a != null && b == null) {
                return -1;
            }
            var a1 = a.distance;
            var b1 = b.distance;
            return (a1 > b1) ? -1 : (a1 < b1) ? 1 : 0;
        };
        var reverseDistanceSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return -1;
            }
            if (a != null && b == null) {
                return 1;
            }
            var a1 = a.distance;
            var b1 = b.distance;
            return (a1 > b1) ? 1 : (a1 < b1) ? -1 : 0;
        };
        var moneySort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return 1;
            }
            if (a != null && b == null) {
                return -1;
            }
            var a1 = a.money;
            var b1 = b.money;
            return (a1 > b1) ? -1 : (a1 < b1) ? 1 : 0;
        };
        var reverseMoneySort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return -1;
            }
            if (a != null && b == null) {
                return 1;
            }
            var a1 = a.money;
            var b1 = b.money;
            return (a1 > b1) ? 1 : (a1 < b1) ? -1 : 0;
        };
        var nameSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return 1;
            }
            if (a != null && b == null) {
                return -1;
            }
            var a1 = Kittymatic.getJobName(a.id);
            var b1 = Kittymatic.getJobName(b.id);
            return (a1 > b1) ? -1 : (a1 < b1) ? 1 : 0;
        };
        var reverseNameSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return -1;
            }
            if (a != null && b == null) {
                return 1;
            }
            var a1 = Kittymatic.getJobName(a.id);
            var b1 = Kittymatic.getJobName(b.id);
            return (a1 > b1) ? 1 : (a1 < b1) ? -1 : 0;
        };
        var motivationSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return 1;
            }
            if (a != null && b == null) {
                return -1;
            }
            var a1 = a.motivation;
            var b1 = b.motivation;
            return (a1 > b1) ? -1 : (a1 < b1) ? 1 : 0;
        };
        var reverseMotivationSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return -1;
            }
            if (a != null && b == null) {
                return 1;
            }
            var a1 = a.motivation;
            var b1 = b.motivation;
            return (a1 > b1) ? 1 : (a1 < b1) ? -1 : 0;
        };


        if (Kittymatic.sortJobTableXp == 1) {
            jobs.sort(experienceSort);
        }
        if (Kittymatic.sortJobTableXp == -1) {
            jobs.sort(reverseExperienceSort);
        }
        if (Kittymatic.sortJobTableDistance == 1) {
            jobs.sort(distanceSort);
        }
        if (Kittymatic.sortJobTableDistance == -1) {
            jobs.sort(reverseDistanceSort);
        }
        if (Kittymatic.sortJobTableMoney == 1) {
            jobs.sort(moneySort);
        }
        if (Kittymatic.sortJobTableMoney == -1) {
            jobs.sort(reverseMoneySort);
        }
        if (Kittymatic.sortJobTableName == 1) {
            jobs.sort(nameSort);
        }
        if (Kittymatic.sortJobTableName == -1) {
            jobs.sort(reverseNameSort);
        }
        if (Kittymatic.sortJobTableMotivation == 1) {
            jobs.sort(motivationSort);
        }
        if (Kittymatic.sortJobTableMotivation == -1) {
            jobs.sort(reverseMotivationSort);
        }
        return jobs;
    };
    Kittymatic.findJob = function (x, y, id) {
        for (var i = 0; i < Kittymatic.allJobs.length; i++) {
            if (Kittymatic.allJobs[i].id == id && Kittymatic.allJobs[i].x == x && Kittymatic.allJobs[i].y == y) {
                return Kittymatic.allJobs[i];
            }
        }
    };
    Kittymatic.addJob = function (x, y, id) {
        if (!Kittymatic.checkIfJobAdded(id)) {
            Kittymatic.addedJobs.push(Kittymatic.findJob(x, y, id));
        }
    };
    Kittymatic.removeJob = function (x, y, id) {
        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            if (Kittymatic.addedJobs[i].id == id && Kittymatic.addedJobs[i].x == x && Kittymatic.addedJobs[i].y == y) {
                Kittymatic.addedJobs.splice(i, 1);
                Kittymatic.consolidePosition(i);
                break;
            }
        }
    };
    Kittymatic.checkIfJobAdded = function (id) {
        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            if (Kittymatic.addedJobs[i].id == id) {
                return true;
            }
        }
        return false;
    };
    Kittymatic.findAddedJob = function (x, y, id) {
        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            if (Kittymatic.addedJobs[i].x == x && Kittymatic.addedJobs[i].y == y && Kittymatic.addedJobs[i].id == id) {
                return Kittymatic.addedJobs[i];
            }
        }
        return null;
    };
    Kittymatic.getJobSet = function (x, y, id) {
        var job = Kittymatic.findAddedJob(x, y, id);
        if (job != null)
            return job.set;
    };
    Kittymatic.setJobSet = function (x, y, id, set) {
        var job = Kittymatic.findAddedJob(x, y, id);
        if (job != null)
            return job.setSet(set);
    };
    Kittymatic.setSetForAllJobs = function () {
        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            if (Kittymatic.addedJobs[i].set == -1)
                Kittymatic.addedJobs[i].setSet(Kittymatic.jobSet);
        }
    };
    Kittymatic.consolidePosition = function (removeIndex) {
        if (removeIndex <= Kittymatic.currentJob.job && Kittymatic.currentJob.job > 0) {
            Kittymatic.currentJob.job--;
        }
        if (Kittymatic.addedJobs.length == 1) {
            Kittymatic.currentJob.direction = true;
        }
    }
    Kittymatic.parseStopMotivation = function () {
        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            var stopMotivation = $(".Kittymaticwindow #x-" + Kittymatic.addedJobs[i].x + "y-" + Kittymatic.addedJobs[i].y + "id-" + Kittymatic.addedJobs[i].id).prop("value");
            if (Kittymatic.isNumber(stopMotivation)) {
                Kittymatic.addedJobs[i].setStopMotivation(parseInt(stopMotivation));
            } else {
                return false;
            }
        }
        return true;
    };
    Kittymatic.getItemImage = function (id) {
        return ItemManager.get(id).wear_image;
    };
    Kittymatic.findAllConsumables = function () {
        if (Kittymatic.searchKeys[Kittymatic.language] == undefined) return;
        var energyConsumes = Bag.search(Kittymatic.searchKeys[Kittymatic.language].energy);
        for (var i = 0; i < energyConsumes.length; i++) {
            Kittymatic.addConsumable(energyConsumes[i]);
        }
        var motivationConsumes = Bag.search(Kittymatic.searchKeys[Kittymatic.language].motivation);
        for (var i = 0; i < motivationConsumes.length; i++) {
            Kittymatic.addConsumable(motivationConsumes[i]);
        }
        var healthConsumes = Bag.search(Kittymatic.searchKeys[Kittymatic.language].health);
        for (var i = 0; i < healthConsumes.length; i++) {
            Kittymatic.addConsumable(healthConsumes[i]);
        }


    };
    Kittymatic.CheckIfConsumableAdded = function (item) {
        if (item == undefined)
            return true;
        for (var i = 0; i < Kittymatic.allConsumables.length; i++) {
            if (Kittymatic.allConsumables[i].id == item.obj.item_id) {
                return true;
            }
        }
        return false;
    };
    Kittymatic.addConsumable = function (item) {
        if (Kittymatic.CheckIfConsumableAdded(item)) {
            return;
        }
        var consumable = new ConsumablePrototype(item.obj.item_id, item.obj.image, item.obj.name);
        var bonuses = Kittymatic.parseConsumableBonuses(item.obj.usebonus);
        if (bonuses[0] == 0 && bonuses[1] == 0 && bonuses[2] == 0)
            return;
        consumable.setEnergy(bonuses[0]);
        consumable.setMotivation(bonuses[1]);
        consumable.setHealth(bonuses[2]);
        consumable.setCount(item.count);

        for (var i = 0; i < Kittymatic.consumablesRemoved.length; i++) {
            if (consumable.id == Kittymatic.consumablesRemoved[i])
                consumable.setSelected(false);
        }

        Kittymatic.allConsumables.push(consumable);
    };
    Kittymatic.removeConsumable = function (item) {
        var index;
        for (var i = 0; i < Kittymatic.allConsumables.length; i++) {
            if (Kittymatic.allConsumables[i].id == item.id) {
                index = i;
                break;
            }
        }
        if (index != undefined) {
            if (Kittymatic.allConsumables[index].count > 1) {
                Kittymatic.allConsumables[index].count--;
            } else {
                Kittymatic.allConsumables.splice(index, 1);
            }
        }
    };
    Kittymatic.parseConsumableBonuses = function (bonuses) {
        var getBonus = function (text, type) {
            switch (type) {
                case 0:
                    text = text.replace(Kittymatic.searchKeys[Kittymatic.language].energyText, "");
                    break;
                case 1:
                    text = text.replace(Kittymatic.searchKeys[Kittymatic.language].motivationText, "");
                    break;
                case 2:
                    text = text.replace(Kittymatic.searchKeys[Kittymatic.language].healthText, "");
                    break;
            }
            text = text.slice(1);
            text = text.replace("%", "");
            return parseInt(text);
        }
        var result = Array(3).fill(0);
        for (var i = 0; i < bonuses.length; i++) {
            var type = -1;
            if (bonuses[i].includes(Kittymatic.searchKeys[Kittymatic.language].energyText)) {
                type = 0;
            } else if (bonuses[i].includes(Kittymatic.searchKeys[Kittymatic.language].motivationText)) {
                type = 1;
            } else if (bonuses[i].includes(Kittymatic.searchKeys[Kittymatic.language].healthText)) {
                type = 2;
            }
            if (type != -1)
                result[type] = getBonus(bonuses[i], type);

        }
        return result;
    };
    Kittymatic.filterConsumables = function (energy, motivation, health) {
        var result = [];
        for (var i = 0; i < Kittymatic.allConsumables.length; i++) {
            if (energy && Kittymatic.allConsumables[i].energy == 0) {
                continue;
            }
            if (motivation && Kittymatic.allConsumables[i].motivation == 0) {
                continue;
            }
            if (health && Kittymatic.allConsumables[i].health == 0) {
                continue;
            }
            result.push(Kittymatic.allConsumables[i]);
        }
        return result;
    };
    Kittymatic.changeConsumableSelection = function (id, selected) {
        for (var i = 0; i < Kittymatic.allConsumables.length; i++) {
            if (Kittymatic.allConsumables[i].id == id) {
                Kittymatic.allConsumables[i].setSelected(selected);
                break;
            }
        }
        for (var i = 0; i < Kittymatic.consumablesRemoved.length; i++) {
            if (Kittymatic.consumablesRemoved[i] == id) {
                if (selected)
                    Kittymatic.consumablesRemoved.splice(i, 1);
                return;
            }
        }
        if (!selected)
            Kittymatic.consumablesRemoved.push(id);

    };
    Kittymatic.changeSelectionAllConsumables = function (selected) {
        for (var i = 0; i < Kittymatic.allConsumables.length; i++) {
            Kittymatic.changeConsumableSelection(Kittymatic.allConsumables[i].id, selected);
        }
    };
    Kittymatic.canUseConsume = function (item) {
        if (BuffList.cooldowns[item.id] != undefined && BuffList.cooldowns[item.id].time > new ServerDate().getTime()) {
            return false;
        }
        return true;
    };
    Kittymatic.useConsumable = async function (itemToUse) {
        Kittymatic.log("Kittymatic.useConsumable");
        var item = Bag.getItemByItemId(itemToUse.id);
        item.showCooldown();
        Kittymatic.currentState = 2;
        while (true) {
            if (Kittymatic.canUseConsume(itemToUse)) {
                if (Kittymatic.healthSet != -1 && itemToUse.health > 0) {
                    await Kittymatic.equipSet(Kittymatic.healthSet);
                    await new Promise(r => setTimeout(r, Kittymatic.settings.setWearDelay * 1000));
                }
                Kittymatic.removeConsumable(itemToUse);
                Kittymatic.consumableUsed.push(itemToUse);
                Kittymatic.statistics.consumablesUsedInSession++;
                Kittymatic.statistics.totalConsumablesUsed++;
                ItemUse.doIt(itemToUse.id);
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        while (true) {
            if (!Kittymatic.canUseConsume(itemToUse)) {
                $(".tw2gui_dialog_framefix").remove();
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        Kittymatic.run();
    };
    Kittymatic.findProperConsumable = function (motivationMissing, energyMissing, healthMissing, averageMotivationMissing, consumables) {

        Kittymatic.log("Kittymatic.findProperConsumable");
        var betterEnergy = function (item1, item2) {
            var distanceItem1 = Math.abs(energyMissing - item1.energy);
            var distanceItem2 = Math.abs(energyMissing - item2.energy);
            return (distanceItem1 < distanceItem2) ? -1 : (distanceItem1 > distanceItem2) ? 1 : 0;
        };
        var betterMotivation = function (item1, item2) {
            var distanceItem1 = Math.abs(averageMotivationMissing - item1.motivation);
            var distanceItem2 = Math.abs(averageMotivationMissing - item2.motivation);
            return (distanceItem2 < distanceItem1) ? item2 : item1;
        };
        var findMotivationConsume = function (consumes) {
            var consumeToChoose = null;
            for (var i = 0; i < consumes.length; i++) {
                if (consumes[i].motivation != 0) {
                    if (consumeToChoose == null) {
                        consumeToChoose = consumes[i];
                    }
                    else {
                        consumeToChoose = betterMotivation(consumeToChoose, consumables[i]);
                    }
                }
            }
            return consumeToChoose;
        };
        var findHealthConsume = function (consumes) {
            for (var i = 0; i < consumes.length; i++) {
                if (consumes[i].health != 0) {
                    return consumes[i];
                }
            }
            return null;
        };
        if (consumables.length == 0) return null;
        var consums = consumables;
        consums = consums.sort(betterEnergy);
        if (energyMissing == 100) {
            return consums[0];
        }
        if (motivationMissing == Kittymatic.addedJobs.length) {
            return findMotivationConsume(consums);
        }
        if (Kittymatic.isHealthBelowLimit()) {
            return findHealthConsume(consums);
        }
        if (energyMissing > 0) {
            for (var i = 0; i < consums.length; i++) {
                if (consums[i].energy > 0)
                    return consums[i];
            }
        }
    };

    Kittymatic.tryUseConsumable = function (result) {
        Kittymatic.log("Trying to use consumable.");
        var healthMissing = Kittymatic.Helper.getMissingHealthPercent();
        var energyMissing = 100 - (Character.energy / Character.maxEnergy) * 100;
        var xpMissing = Character.getMaxExperience4Level() - Character.getExperience4Level();
        var jobsNeeded = xpMissing / Kittymatic.Helper.calculateAverageXP() - Character.energy;
        if (jobsNeeded < 0)
            jobsNeeded = 0;

        if (energyMissing > jobsNeeded / (Character.maxEnergy / 100))
            energyMissing = jobsNeeded / (Character.maxEnergy / 100);

        energyMissing = Math.ceil(energyMissing);

        var motivationMissing = Kittymatic.jobsBelowMotivation(result);
        var consumables = Kittymatic.allConsumables;
        var averageMotivationMissing = Kittymatic.averageMissingMotivation(result);
        var selectedConsumes = [];
        for (var i = 0; i < consumables.length; i++) {
            if (consumables[i].selected)
                selectedConsumes.push(consumables[i]);
        }
        var itemToUse = Kittymatic.findProperConsumable(motivationMissing, energyMissing, healthMissing, averageMotivationMissing, selectedConsumes);
        if (itemToUse == null) return false;
        Kittymatic.useConsumable(itemToUse);
        return true;
    };
    Kittymatic.findConsumableWasteless = function (energyMissing, healthMissing, averageMotivationMissing, consumables) {
        if (!Kittymatic.settings.addEnergy)
            energyMissing = 0;
        if (!Kittymatic.settings.addHealth)
            healthMissing = 0;
        if (!Kittymatic.settings.addMotivation)
            averageMotivationMissing = 0;

        Kittymatic.log("Kittymatic.findConsumableWasteless");
        //Sorting out wasteful consumables
        var acceptableConsumables = [];

        for (var i = 0; i < consumables.length; i++) {
            if (consumables[i].energy > energyMissing
                || consumables[i].health > healthMissing + Kittymatic.settings.acceptableWaste
                || consumables[i].motivation > averageMotivationMissing + Kittymatic.settings.acceptableWaste)
                continue;
            acceptableConsumables.push(consumables[i]);
        }

        var energyWeight = 1;
        var motivationWeight = 100 / ((100 - Kittymatic.averageStopMotivation()));
        var healthWeight = 1 / (Kittymatic.Helper.getHealthPercent() / 100);

        var sortScored = function (item1, item2) {
            var item1Score = 0, item2Score = 0;
            var item1Energy = item1.energy;
            var item1Health = item1.health;
            if (item1Health > healthMissing) item1Health = healthMissing;
            var item1Motivation = item1.motivation;
            if (item1Motivation > averageMotivationMissing) item1Motivation = averageMotivationMissing;

            item1Score = item1Energy * energyWeight + item1Health * healthWeight + item1Motivation * motivationWeight;

            var item2Energy = item2.energy;
            var item2Health = item2.health;
            if (item2Health > healthMissing) item2Health = healthMissing;
            var item2Motivation = item2.motivation;
            if (item2Motivation > averageMotivationMissing) item2Motivation = averageMotivationMissing;

            item2Score = item2Energy * energyWeight + item2Health * healthWeight + item2Motivation * motivationWeight;

            return (item1Score > item2Score) ? -1 : (item1Score < item2Score) ? 1 : 0;

        }

        acceptableConsumables = acceptableConsumables.sort(sortScored);

        if (acceptableConsumables.length > 0) {
            var itemToUse = acceptableConsumables[0];
            if (itemToUse.energy <= energyMissing
                && (itemToUse.motivation <= (averageMotivationMissing + Kittymatic.settings.acceptableWaste)
                    || (itemToUse.health <= (healthMissing + Kittymatic.settings.acceptableWaste))))
                return itemToUse;
        }
        return null;
    };

    Kittymatic.tryUseConsumableRuntime = async function (motivations) {
        if (!Kittymatic.settings.useConsumablesRuntime)
            return null;
        Kittymatic.log("Trying to use consumable (runtime).");
        var healthMissing = Kittymatic.Helper.getMissingHealthPercent();
        var energyMissing = 100 - (Character.energy / Character.maxEnergy) * 100;
        var xpMissing = Character.getMaxExperience4Level() - Character.getExperience4Level();
        var jobsNeeded = xpMissing / Kittymatic.Helper.calculateAverageXP() - Character.energy;
        if (jobsNeeded < 0)
            jobsNeeded = 0;

        if (energyMissing > jobsNeeded / (Character.maxEnergy / 100))
            energyMissing = jobsNeeded / (Character.maxEnergy / 100);

        energyMissing = Math.ceil(energyMissing);
        var consumables = Kittymatic.allConsumables;
        var averageMotivationMissing = Kittymatic.averageMissingMotivation(motivations);
        var selectedConsumes = [];
        for (var i = 0; i < consumables.length; i++) {
            if (consumables[i].selected)
                selectedConsumes.push(consumables[i]);
        }
        var itemToUse = Kittymatic.findConsumableWasteless(energyMissing, healthMissing, averageMotivationMissing, selectedConsumes);

        if (itemToUse == null) {
            return null;
        }
        var item = Bag.getItemByItemId(itemToUse.id);
        item.showCooldown();
        if (Kittymatic.canUseConsume(itemToUse)) {

            await Kittymatic.useConsumableRuntime(itemToUse);
        }
        else return null;

        return itemToUse;

    }

    Kittymatic.useConsumableRuntime = async function (itemToUse) {
        Kittymatic.log("Kittymatic.useConsumableRuntime");
        var item = Bag.getItemByItemId(itemToUse.id);
        item.showCooldown();
        Kittymatic.currentState = 2;
        while (true) {
            if (Kittymatic.canUseConsume(itemToUse)) {
                if (Kittymatic.healthSet != -1 && itemToUse.health > 0) {
                    await Kittymatic.equipSet(Kittymatic.healthSet);
                }
                Kittymatic.removeConsumable(itemToUse);
                Kittymatic.consumableUsed.push(itemToUse);
                Kittymatic.statistics.consumablesUsedInSession++;
                Kittymatic.statistics.totalConsumablesUsed++;
                ItemUse.doIt(itemToUse.id);
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        while (true) {
            if (!Kittymatic.canUseConsume(itemToUse)) {
                $(".tw2gui_dialog_framefix").remove();
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        return true;
    };

    Kittymatic.calculateDistances = function () {
        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            Kittymatic.addedJobs[i].calculateDistance();
        }
    };
    Kittymatic.createDistanceMatrix = function () {
        var distances = new Array(Kittymatic.addedJobs.length);
        for (var i = 0; i < distances.length; i++) {
            distances[i] = new Array(Kittymatic.addedJobs.length);
        }
        for (var i = 0; i < distances.length; i++) {
            for (var j = i; j < distances[i].length; j++) {
                if (i == j) {
                    distances[i][j] = distances[j][i] = Number.MAX_SAFE_INTEGER;
                    continue;
                }
                distances[i][j] = distances[j][i] = Map.calcWayTime({ x: Kittymatic.addedJobs[i].x, y: Kittymatic.addedJobs[i].y }, { x: Kittymatic.addedJobs[j].x, y: Kittymatic.addedJobs[j].y });
            }
        }
        return distances;
    };
    Kittymatic.createRoute = function () {
        Kittymatic.currentJob = { job: 0, direction: true }
        Kittymatic.calculateDistances();
        var closestJobIndex = 0;
        var closestDistance = Kittymatic.addedJobs[0].distance;
        var route = [];
        var distances = Kittymatic.createDistanceMatrix();
        var getClosestJob = function (index, route, distances) {
            var closestDistance = Number.MAX_SAFE_INTEGER;
            var closestIndex = -1;
            for (var i = 0; i < distances.length; i++) {
                if (index == i || route.includes(i)) {
                    continue;
                }
                if (distances[i][index] < closestDistance) {
                    closestDistance = distances[i][index];
                    closestIndex = i;
                }
            }
            return closestIndex;
        };
        for (var i = 1; i < Kittymatic.addedJobs.length; i++) {
            if (Kittymatic.addedJobs[i].distance < closestDistance) {
                closestDistance = Kittymatic.addedJobs[i].distance;
                closestJobIndex = i;
            }
        }
        route.push(closestJobIndex);
        while (route.length < Kittymatic.addedJobs.length) {
            var closestJob = getClosestJob(route[route.length - 1], route, distances);
            route.push(closestJob);
        }
        var addedJobsOrder = [];
        for (var i = 0; i < route.length; i++) {
            addedJobsOrder.push(Kittymatic.addedJobs[route[i]]);
        }
        Kittymatic.addedJobs = addedJobsOrder;
    };

    Kittymatic.isCustomSetEquiped = function (set) {
        var keys = ["head", "body", "pants", "neck", "right_arm", "animal", "yield", "left_arm", "belt", "foot"];
        for (var i = 0; i < keys.length; i++) {
            if (set[keys[i]] == null)
                continue;
            if (!Kittymatic.isWearing(set[keys[i]])) return false;
        }
        return true;
    }
    Kittymatic.equipCustomSet = async function (set) {
        Kittymatic.log("Kittymatic.equipCustomSet")
        var keys = ["head", "body", "pants", "neck", "right_arm", "animal", "yield", "left_arm", "belt", "foot"];

        for (tries = 0; tries < 30; tries++) {
            if (tries % 10 == 0) {
                for (var i = 0; i < keys.length; i++) {
                    if (set[keys[i]] != null && !Kittymatic.isWearing(set[keys[i]]))
                        Wear.carry(Bag.getItemByItemId(set[keys[i]]));
                }
            }
            var finished = Kittymatic.isCustomSetEquiped(set);
            if (finished)
                break;
            await new Promise(r => setTimeout(r, 500));
        }
        var finished = Kittymatic.isCustomSetEquiped(set);
        if (!finished)
            Kittymatic.log("Can't equip set");


        return Promise.resolve(true);

    }

    Kittymatic.getCustomSetName = function (index) {
        if (!Kittymatic.customSets[index].name || Kittymatic.customSets[index].name.length < 1)
            return "Custom Set " + index;
        else return Kittymatic.customSets[index].name;
    }
    Kittymatic.addCustomSet = function (setName) {
        var keys = ["head", "body", "pants", "neck", "right_arm", "animal", "yield", "left_arm", "belt", "foot"];
        set = {};
        for (var i = 0; i < keys.length; i++) {
            if (Wear.wear[keys[i]] != null) {
                set[keys[i]] = Wear.wear[keys[i]].obj.item_id;
                console.log(Wear.wear[keys[i]].obj.item_id + " added to custom set");
            }
        }
        set.name = setName;
        Kittymatic.customSets.push(set);
    }

    Kittymatic.onCustomSetRemoved = function (removed_index) {
        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            jobIndex = parseInt(Kittymatic.addedJobs[i].set);
            if (jobIndex == removed_index + 20)
                Kittymatic.addedJobs[i].set = "-1";
            else if (jobIndex > removed_index + 20) {
                newIndex = jobIndex - 1;
                Kittymatic.addedJobs[i].set = newIndex.toString();
            }
        }

        travelIndex = parseInt(Kittymatic.travelSet);
        if (travelIndex == removed_index + 20) {
            Kittymatic.travelSet = "-1";
        }
        else if (travelIndex > removed_index + 20) {
            newIndex = travelIndex - 1;
            Kittymatic.travelSet = newIndex.toString();
        }


        jobIndex = parseInt(Kittymatic.jobSet);
        if (jobIndex == removed_index + 20) {
            Kittymatic.jobSet = "-1";
        }
        else if (jobIndex > removed_index + 20) {
            newIndex = jobIndex - 1;
            Kittymatic.jobSet = newIndex.toString();
        }


        healthIndex = parseInt(Kittymatic.healthSet);
        if (healthIndex == removed_index + 20) {
            Kittymatic.healthSet = "-1";
        }
        else if (healthIndex > removed_index + 20) {
            newIndex = healthIndex - 1;
            Kittymatic.healthSet = newIndex.toString();
        }


        regenerationIndex = parseInt(Kittymatic.regenerationSet);
        if (regenerationIndex == removed_index + 20) {
            Kittymatic.regenerationSet = "-1";
        }
        else if (regenerationIndex > removed_index + 20) {
            newIndex = regenerationIndex - 1;
            Kittymatic.regenerationSet = newIndex.toString();
        }
    }
    Kittymatic.removeCustomSet = function (index) {
        if (index >= 0 && index < Kittymatic.customSets.length)
            Kittymatic.customSets.splice(index, 1);
        else return;

        if (index >= Kittymatic.customSets.length) {
            if (Kittymatic.customSets.length == 0)
                Kittymatic.selectedSet = Kittymatic.sets.length - 1;
            else
                Kittymatic.selectedSet = 20 + index - 1;
        }
        Kittymatic.onCustomSetRemoved(index);
    }

    Kittymatic.modifyCustomSet = function (index) {
        if (!(index >= 0 && index < Kittymatic.customSets.length))
            return;
        var keys = ["head", "body", "pants", "neck", "right_arm", "animal", "yield", "left_arm", "belt", "foot"];
        set = {};
        for (var i = 0; i < keys.length; i++) {
            if (Wear.wear[keys[i]] != null) {
                set[keys[i]] = Wear.wear[keys[i]].obj.item_id;
                console.log(Wear.wear[keys[i]].obj.item_id + " added to custom set");
            }
        }
        set.name = Kittymatic.customSets[index].name;
        Kittymatic.customSets[index] = set;
    }

    Kittymatic.modifyCustomSetName = function (index, name) {
        if (!(index >= 0 && index < Kittymatic.customSets.length))
            return;
        Kittymatic.customSets[index].name = name;
    }

    Kittymatic.clearCustomSets = function () {
        Kittymatic.customSets = [];
    }

    Kittymatic.equipSet = async function (set) {
        Kittymatic.log("Kittymatic.equipSet");
        if (set == -1) return true;

        if (set < Kittymatic.sets.length) {
            EquipManager.switchEquip(Kittymatic.sets[set].equip_manager_id);
            while (true) {
                var finished = Kittymatic.isGearEquiped(Kittymatic.getSetItemArray(Kittymatic.sets[set]));
                if (finished) break;
                await new Promise(r => setTimeout(r, 1));
            }
        }
        else if ((set - 20) >= 0 && (set - 20) < Kittymatic.customSets.length) {
            idx = set - 20;
            await Kittymatic.equipCustomSet(Kittymatic.customSets[idx]);
        }
        return Promise.resolve(true);

    };

    ///// WEST CODE OVERRIDE/////

    EquipManager.deleteEquip = function (equipId) {
        Ajax.remoteCall('inventory', 'delete_equip', {
            id: equipId
        }, function (data) {
            if (data.error) {
                new UserMessage(data.msg, UserMessage.TYPE_ERROR).show();
            } else {
                for (var i = 0; EquipManager.list.length > i; i++) {
                    if (EquipManager.list[i].equip_manager_id == equipId) {
                        new UserMessage("Deleting sets may cause unexpected problems with Kittymatic. Please check your set sets!!!", UserMessage.TYPE_ERROR).show();
                        EquipManager.list.splice(i, 1);
                    }
                }
                $("#equip_manager_list").html(EquipManager.buildEquipList());
            }
        });
    }

    EquipManager.save = function () {
        Ajax.remoteCall('inventory', 'save_equip', {
            name: $('#equip_name').val()
        }, function (data) {
            if (data.error) {
                new UserMessage(data.msg, UserMessage.TYPE_ERROR).show();
            } else {
                new UserMessage("Adding sets may cause unexpected problems with Kittymatic. Please check your set sets!!!", UserMessage.TYPE_ERROR).show();
                EquipManager.list.push(data.data);
                $("#equip_manager_list").html(EquipManager.buildEquipList());
            }
        });
    }

    ///// WEST CODE OVERRIDE END /////

    Kittymatic.getSetItemArray = function (set) {
        var items = [];
        if (set.head != null)
            items.push(set.head);
        if (set.neck != null)
            items.push(set.neck);
        if (set.body != null)
            items.push(set.body);
        if (set.right_arm != null)
            items.push(set.right_arm);
        if (set.left_arm != null)
            items.push(set.left_arm);
        if (set.belt != null)
            items.push(set.belt);
        if (set.foot != null)
            items.push(set.foot);
        if (set.animal != null)
            items.push(set.animal);
        if (set.yield != null)
            items.push(set.yield);
        if (set.pants != null)
            items.push(set.pants);
        return items;
    };
    Kittymatic.isWearing = function (itemId) {
        if (Wear.wear[ItemManager.get(itemId).type] == undefined) return false;
        return Wear.wear[ItemManager.get(itemId).type].obj.item_id == itemId;
    };
    Kittymatic.isGearEquiped = function (items) {
        for (var i = 0; i < items.length; i++) {
            if (!Kittymatic.isWearing(items[i])) return false;
        }
        return true;
    }


    Kittymatic.getBestGear = function (jobid) {
        Kittymatic.log("Kittymatic.getBestGear");
        var modelId = function (jobid) {
            for (var i = 0; i < JobsModel.Jobs.length; i++) {
                if (JobsModel.Jobs[i].id == jobid)
                    return i;
            }
            return -1;
        }
        var result = west.item.Calculator.getBestSet(JobsModel.Jobs[modelId(jobid)].get('skills'), jobid);
        var resultItems = result && result.getItems() || [];

        var invItems = Bag.getItemsByItemIds(resultItems), invItem, wearItem, bestItems = [];
        for (var i = 0; i < invItems.length; i++) {
            invItem = invItems[i];
            wearItem = Wear.get(invItem.getType());

            if (!wearItem
                || (wearItem && (wearItem.getItemBaseId() !== invItem.getItemBaseId()
                    || wearItem.getItemLevel() < invItem.getItemLevel()))) {
                bestItems.push(invItem.obj.item_id);
            }

        }

        return bestItems;
    };
    Kittymatic.equipBestGear = async function (jobid) {
        Kittymatic.log("Kittymatic.equipBestGear");
        var bestGear = Kittymatic.getBestGear(jobid);
        if (bestGear == undefined) {
            return Promise.resolve(true);
        }
        for (var tries = 0; tries < 20; tries++) {

            if (tries % 5 == 0) {
                for (var i = 0; i < bestGear.length; i++) {
                    if (!Kittymatic.isWearing(bestGear[i]))
                        Wear.carry(Bag.getItemByItemId(bestGear[i]));
                }
            }
            var finished = Kittymatic.isGearEquiped(bestGear);
            if (finished)
                break;
            await new Promise(r => setTimeout(r, 1000));
        }
        var finished = Kittymatic.isGearEquiped(bestGear);
        if (!finished)
            Kittymatic.log("Can't equip best gear");



        return Promise.resolve(true);
    };
    Kittymatic.checkMotivation = async function () {
        Kittymatic.log("Kittymatic.checkMotivaton");

        var index = 0;
        var motivations = [];
        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            motivations.push(null);
        }
        var check = function (index, motivations) {
            Kittymatic.loadJobMotivation(index, function (motivation) {
                motivations[index] = motivation;
            });
        };

        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            check(i, motivations);
        }

        while (true) {
            var good = true;
            for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
                if (motivations[i] == null)
                    good = false;
            }
            if (good)
                break;
            await new Promise(r => setTimeout(r, 10));
        }
        return motivations;
    };
    Kittymatic.isMotivationAbove = function (result) {
        Kittymatic.log("Kittymatic.isMotivationAbove");
        for (var i = 0; i < result.length; i++) {
            if (result[i] > Kittymatic.addedJobs[i].stopMotivation) {
                return true;
            }
        }
        return false;
    };
    Kittymatic.getBackToJobAfterMotivationStop = function () {

    };
    Kittymatic.jobsBelowMotivation = function (result) {
        var count = 0;
        for (var i = 0; i < result.length; i++) {
            if (result[i] <= Kittymatic.addedJobs[i].stopMotivation) {
                count++;
            }
        }
        return count;
    };
    Kittymatic.averageMissingMotivation = function (result) {
        var motivation = 0;
        for (var i = 0; i < result.length; i++) {
            motivation += (100 - result[i]);
        }
        return motivation / result.length;
    };
    Kittymatic.averageStopMotivation = function () {
        var motivation = 0;
        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            motivation += Kittymatic.addedJobs[i].stopMotivation;
        }
        return motivation / Kittymatic.addedJobs.length;
    };

    Kittymatic.isHealthBelowLimit = function () {
        if (Kittymatic.settings.healthStop >= (Character.health)) {
            return true;
        }
        return false;
    };
    Kittymatic.isStopMotivationZero = function () {
        for (var i = 0; i < Kittymatic.addedJobs.length; i++) {
            if (Kittymatic.addedJobs[i].stopMotivation == 0) {
                return true;
            }
        }
        return false;
    };
    Kittymatic.canAddMissing = function (result) {
        Kittymatic.log("Kittymatic.canAddMissing");
        if (!Kittymatic.settings.addMotivation && Kittymatic.jobsBelowMotivation(result) && !Kittymatic.isStopMotivationZero()) {
            alert("Can't continue because of motivation");
            return false;
        }
        if (!Kittymatic.settings.addEnergy && Character.energy == 0) {
            alert("Can't continue because of energy");
            return false;
        }
        if (!Kittymatic.settings.addHealth && Kittymatic.isHealthBelowLimit()) {
            alert("Can't continue because of health");
            return false;
        }
        return true;
    };
    Kittymatic.finishRun = function () {
        Kittymatic.log("Kittymatic.finishRun");
        Kittymatic.currentState = 0;
        Kittymatic.isRunning = false;
        Kittymatic.selectTab("chosenJobs");
        alert("Finished");
    };
    Kittymatic.updateStatistics = function (oldXp) {
        var xpDifference = Character.experience - oldXp;
        Kittymatic.statistics.xpInSession += xpDifference;
        Kittymatic.statistics.totalXp += xpDifference;
    }

    Kittymatic.tryWarnUser = async function () {
        if (!Kittymatic.settings.addEnergy) {
            new UserMessage("Add Energy is disabled in the Settings tab", UserMessage.TYPE_ERROR).show();
            await new Promise(r => setTimeout(r, 2200));
        }
        if (!Kittymatic.settings.addMotivation) {
            new UserMessage("Add Motivation is disabled in the Settings tab", UserMessage.TYPE_ERROR).show();
            await new Promise(r => setTimeout(r, 2200));
        }
        if (!Kittymatic.settings.addHealth) {
            new UserMessage("Add Health is disabled in the Settings tab", UserMessage.TYPE_ERROR).show();
            await new Promise(r => setTimeout(r, 2200));
        }
        if (!Kittymatic.settings.goToBank) {
            new UserMessage("Put money to bank is disabled in the Settings tab", UserMessage.TYPE_ERROR).show();
            await new Promise(r => setTimeout(r, 2200));
        }
        if (Kittymatic.allConsumables.length == 0) {
            new UserMessage("There are no consumables loaded", UserMessage.TYPE_ERROR).show();
            await new Promise(r => setTimeout(r, 2200));
        }
        if (Kittymatic.settings.healthStop < 100) {
            new UserMessage("Health stop is below 100. Be careful!", UserMessage.TYPE_ERROR).show();
            await new Promise(r => setTimeout(r, 2200));
        }
        new UserMessage("Running Kittymatic not on the main tab may cause errors", UserMessage.TYPE_ERROR).show();

    }

    Kittymatic.run = async function () {
        Kittymatic.log("Kittymatic.run");
        Kittymatic.Helper.checkLevel();
        var motivations = await Kittymatic.checkMotivation();


        if ((Kittymatic.settings.goToBank == true) && Kittymatic.isMoneyAboveLimit()) {

            await Kittymatic.tryUseConsumableRuntime(motivations);
            Kittymatic.goToTown();
        }
        else if ((Kittymatic.isMotivationAbove(motivations) || Kittymatic.isStopMotivationZero()) && Character.energy > 0 && !Kittymatic.isHealthBelowLimit()) {
            Kittymatic.currentState = 1;
            Kittymatic.prepareJobRun(Kittymatic.currentJob.job);
            console.log("Kittymatic running correctly");
        } else {
            console.log("Kittymatic not running correctly");
            if (!Kittymatic.canAddMissing(motivations)) {
                Kittymatic.finishRun();
            }
            else {
                var answer = Kittymatic.tryUseConsumable(motivations);
                if (!answer) {
                    Kittymatic.finishRun();
                }
            }
        }
    };
    Kittymatic.prepareJobRun = function (index) {
        Kittymatic.log("Kittymatic.prepareJobRun");
        setTimeout(function () {
            Kittymatic.loadJobMotivation(index, async function (motivation) {
                if (Character.energy == 0 || Kittymatic.isHealthBelowLimit()) {
                    console.log("something needs to be used, energy healthbelowlimit something");
                    Kittymatic.run();
                }
                else if (motivation <= Kittymatic.addedJobs[index].stopMotivation && Kittymatic.addedJobs[index].stopMotivation > 0) {
                    var motivations = await Kittymatic.checkMotivation();
                    var item = await Kittymatic.tryUseConsumableRuntime(motivations);

                    var fill = 0;
                    if (item != null)
                        fill = item.motivation;

                    if (motivation + fill > Kittymatic.addedJobs[index].stopMotivation) {
                        Kittymatic.prepareJobRun(index);
                    }
                    else if (Kittymatic.isMotivationAbove(motivations)) {
                        Kittymatic.changeJob(motivations);
                    } else {
                        Kittymatic.run();
                    }


                } else
                    if (Map.calcWayTime(Character.position, { x: Kittymatic.addedJobs[index].x, y: Kittymatic.addedJobs[index].y }) == 0) {
                        var maxJobs;
                        (Premium.hasBonus('automation')) ? maxJobs = 9 : maxJobs = 4;
                        if (Kittymatic.addedJobs[index].stopMotivation != 0) {
                            var numberOfJobs = Math.min(Math.min(motivation - Kittymatic.addedJobs[index].stopMotivation, Character.energy), maxJobs);
                        } else {
                            var numberOfJobs = Math.min(Character.energy, maxJobs);
                        }

                        Kittymatic.runJob(index, numberOfJobs);
                    } else {
                        await Kittymatic.equipSet(Kittymatic.travelSet);
                        if (Kittymatic.travelSet >= 20)
                            await new Promise(r => setTimeout(r, 500));
                        if ((Kittymatic.settings.goToBank == true) && Kittymatic.isMoneyAboveLimit()) {
                            Kittymatic.run();
                        }
                        else {
                            Kittymatic.walkToJob(index);
                        }
                    }
            });
        }, Kittymatic.generateRandomNumber(Kittymatic.settings.jobDelayMin, Kittymatic.settings.jobDelayMax) * 1000);
    };
    Kittymatic.getAvailableJobToWalkTo = function (index) {
        var JobData = JobList.getJobById(index);
        if (!JobData.canDo()) {
            console.log("Job too big to walk to.");
            var grouplist = JobList.getJobsByGroupId(JobData.groupid);
            for (var i = 0; i < grouplist.length; i++) {
                if (grouplist[i].calcJobPoints() > grouplist[i].malus)
                    return grouplist[i].id;
            }
            for (var i = 0; i < grouplist.length; i++) {
                if (grouplist[i].level <= Character.level)
                    return grouplist[i].id;
            }

            return index;
        }
        else return index;
    };

    Kittymatic.startJob = function (index, x, y, jobTime, num, message) {
        Kittymatic.log("Kittymatic.startJob");
        if (typeof message === 'string') {
        }
        else message = "";
        var JobData = JobList.getJobById(index);
        message = message + " | " + JobData.name + " (x" + num + ")";
        Kittymatic.log(message);


        if (TaskQueue.busy) {
            TaskQueue.toAdd = [];
            TaskQueue.busy = false;
        }

        for (var i = 0; i < num; i++) {
            JobWindow.startJob(index, x, y, jobTime);
        }
    }

    Kittymatic.walkToJob = async function (index) {
        Kittymatic.log("Kittymatic.walkToJob");
        var walkIndex = Kittymatic.getAvailableJobToWalkTo(Kittymatic.addedJobs[index].id);
        Kittymatic.startJob(walkIndex, Kittymatic.addedJobs[index].x, Kittymatic.addedJobs[index].y, 15, 1, "walk to job");
        await new Promise(r => setTimeout(r, 2000));
        var ms = TaskQueue.queue[0].data.date_start - get_server_date().valueOf();
        var ss = (ms / 1000 - (ms % 1000) / 1000) % 60;
        var mins = ms / 60000 - (ms % 60000) / 60000;

        Kittymatic.log("Waiting to get there! (time: " + mins + ":" + ss + ")");


        while (true) {
            if (Map.calcWayTime(Character.position, { x: Kittymatic.addedJobs[index].x, y: Kittymatic.addedJobs[index].y }) == 0
                || TaskQueue.queue.length == 0) {
                break;
            }
            if (!Kittymatic.isRunning) {
                break;
            }
            await new Promise(r => setTimeout(r, 100));
        }
        await Kittymatic.cancelJobs();
        Kittymatic.log("Reached there!");
        await new Promise(r => setTimeout(r, 1000));
        if (Kittymatic.isRunning)
            Kittymatic.prepareJobRun(index);
    };
    Kittymatic.sleep = async function () {
        Kittymatic.log("Kittymatic.sleep");
        if (Kittymatic.settings.enableRegeneration && Kittymatic.selectedSleepPlace != -2) {
            //if sleep place is town
            if (Kittymatic.selectedSleepPlace == -1) {
                TaskQueue.add(new TaskWalk(Kittymatic.homeTown.town_id, 'town'));
            } else {
                TaskQueue.add(new TaskWalk(Kittymatic.forts[Kittymatic.selectedSleepPlace].fort_id, 'fort'));
            }

            while (true) {
                if (Map.calcWayTime(Character.position, { x: Kittymatic.addedJobs[index].x, y: Kittymatic.addedJobs[index].y }) == 0) {
                    break;
                }
                if (!Kittymatic.isRunning) {
                    break;
                }
                await new Promise(r => setTimeout(r, 1));
            }
        }

    }
    Kittymatic.changeJob = function (motivations) {
        Kittymatic.log("Kittymatic.changeJob");
        Kittymatic.currentJob.job++;
        if (Kittymatic.currentJob.job == Kittymatic.addedJobs.length) {
            Kittymatic.currentJob.job = 0;
        }

        if (motivations[Kittymatic.currentJob.job] <= Kittymatic.addedJobs[Kittymatic.currentJob.job].stopMotivation) {
            Kittymatic.changeJob(motivations);
            return;
        }
        Kittymatic.setStatisticsInStorage();
        Kittymatic.run();
    };
    Kittymatic.runJob = async function (jobIndex, jobCount) {
        Kittymatic.log("Kittymatic.runJob");
        Kittymatic.statistics.jobsInSession += jobCount;
        Kittymatic.statistics.totalJobs += jobCount;
        var oldXp = Character.experience;
        var oldMoney = Character.money;
        await Kittymatic.equipBestGear(Kittymatic.addedJobs[jobIndex].id);


        Kittymatic.startJob(Kittymatic.addedJobs[jobIndex].id, Kittymatic.addedJobs[jobIndex].x, Kittymatic.addedJobs[jobIndex].y, 15, jobCount, "working");

        await new Promise(r => setTimeout(r, Kittymatic.settings.setWearDelay * 1000));
        Kittymatic.equipSet(Kittymatic.addedJobs[jobIndex].set);
        while (true) {
            if (TaskQueue.queue.length == 0) {
                Kittymatic.Stats.updateXP(oldXp);
                Kittymatic.Stats.updateMoney(oldMoney);
                //Kittymatic.updateStatistics(oldXp);
                Kittymatic.setStatisticsInStorage();
                Kittymatic.prepareJobRun(jobIndex);
                return;
            }
            if (!Kittymatic.isRunning || Kittymatic.isHealthBelowLimit()) {

                if (Kittymatic.isHealthBelowLimit())
                    console.log("Health below limit :(");

                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        Kittymatic.statistics.jobsInSession -= TaskQueue.queue.length;
        Kittymatic.statistics.totalJobs -= TaskQueue.queue.length;
        Kittymatic.Stats.updateXP(oldXp);
        Kittymatic.Stats.updateMoney(oldMoney);
        //Kittymatic.updateStatistics(oldXp);
        Kittymatic.setStatisticsInStorage();
        await Kittymatic.cancelJobs();

        if (Kittymatic.isRunning) {
            Kittymatic.run();
        }
    };
    Kittymatic.cancelJobs = async function () {
        Kittymatic.log("Kittymatic.cancelJobs");
        if (TaskQueue.queue.length > 0)
            TaskQueue.cancelAll();
        await new Promise(r => setTimeout(r, 2000));
        return Promise.resolve(true);
    };
    Kittymatic.cancelJob = function (id) {
        Kittymatic.log("Kittymatic.cancelJob(" + id + ")");
        if (TaskQueue.queue.length >= id) {
            TaskQueue.cancel(id);
        }
    };
    Kittymatic.cancelZeroJobs = async function () {
        Kittymatic.log("Kittymatic.cancelZeroJobs");
        for (let i = TaskQueue.queue.length - 1; i >= 0; i--) {
            if (TaskQueue.queue[i].data.job_points < 0)
                Kittymatic.cancelJob(i);
        }
        await new Promise(r => setTimeout(r, 2000));
        return Promise.resolve(true);
    }

    Kittymatic.delCookies = function () {
        var expiracyDateTemporary = new Date();

        var temporaryObject = {};
        var permanentObject = {};

        var jsonTemporary = JSON.stringify(temporaryObject);
        var jsonPermanent = JSON.stringify(permanentObject);
        document.cookie = "Kittymatictemporary=" + jsonTemporary + ";expires=" + expiracyDateTemporary.toGMTString() + ";";
        document.cookie = "Kittymaticpermanent=" + jsonPermanent + ";expires=" + expiracyDateTemporary.toGMTString() + ";";
    };


    Kittymatic.setStatisticsInStorage = function () {

        var stats = {
            totalJobs: Kittymatic.statistics.totalJobs,
            totalXp: Kittymatic.statistics.totalXp,
            totalMoney: Kittymatic.statistics.totalMoney,
            totalItemsDropped: Kittymatic.statistics.totalItemsDropped,
            highestPricedItemTotal: Kittymatic.statistics.highestPricedItemTotal,
            totalMoneyFromItems: Kittymatic.statistics.totalMoneyFromItems,
            totalConsumablesUsed: Kittymatic.statistics.totalConsumablesUsed,
        }

        var jsonStats = JSON.stringify(stats);
        localStorage.KittymaticStats = jsonStats;
    }

    Kittymatic.getStatisticsInStorage = function () {
        if (localStorage.KittymaticStats) {
            var obj = localStorage.KittymaticStats.split(";");
            var statsObject = JSON.parse(obj[0]);

            if(typeof(statsObject.totalJobs) !== "undefined")
                Kittymatic.statistics.totalJobs = statsObject.totalJobs;
            if(typeof(statsObject.totalXp) !== "undefined")
                Kittymatic.statistics.totalXp = statsObject.totalXp;
            if(typeof(statsObject.totalMoney) !== "undefined")
                Kittymatic.statistics.totalMoney = statsObject.totalMoney;
            if(typeof(statsObject.totalItemsDropped) !== "undefined")
                Kittymatic.statistics.totalItemsDropped = statsObject.totalItemsDropped;
            if(typeof(statsObject.highestPricedItemTotal) !== "undefined")
                Kittymatic.statistics.highestPricedItemTotal = statsObject.highestPricedItemTotal;
            if(typeof(statsObject.totalMoneyFromItems) !== "undefined")
                Kittymatic.statistics.totalMoneyFromItems = statsObject.totalMoneyFromItems;
            if(typeof(statsObject.totalConsumablesUsed) !== "undefined")
                Kittymatic.statistics.totalConsumablesUsed = statsObject.totalConsumablesUsed;
        }
    }

    Kittymatic.setPermanentInStorage = function () {
        var permanentObject = {
            version: Kittymatic.version,
            subversion: Kittymatic.subversion,
            settings: Kittymatic.settings,
            customSets: Kittymatic.customSets,
            consumablesRemoved: Kittymatic.consumablesRemoved,
            jobPoints: Kittymatic.jobPoints,
            lastLevel: Kittymatic.lastLevel

        };
        var jsonPermanent = JSON.stringify(permanentObject);

        localStorage.KittymaticPerma = jsonPermanent;
    }

    Kittymatic.setTemporaryInStorage = function () {
        function isDST(d) {
            let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
            let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
            return Math.max(jan, jul) !== d.getTimezoneOffset();
        }

        var expiracyDateTemporary = new Date();
        var hour = expiracyDateTemporary.getHours();

        if (!isDST(new Date())) {
            expiracyDateTemporary.setHours(2, 0, 0);
            if (hour >= 2)
                expiracyDateTemporary.setDate(expiracyDateTemporary.getDate() + 1);
        }
        else {
            expiracyDateTemporary.setHours(3, 0, 0);
            if (hour >= 3)
                expiracyDateTemporary.setDate(expiracyDateTemporary.getDate() + 1);

        }
        var temporaryObject = {
            addedJobs: Kittymatic.addedJobs,
            travelSet: Kittymatic.travelSet,
            jobSet: Kittymatic.jobSet,
            healthSet: Kittymatic.healthSet,
            currentJob: Kittymatic.currentJob,
            expiry: expiracyDateTemporary.valueOf()
        };


        var jsonTemporary = JSON.stringify(temporaryObject);
        localStorage.KittymaticTemp = jsonTemporary;

        Kittymatic.log("Temporary cookie set to " + expiracyDateTemporary.toString());

    }


    Kittymatic.getPermanentInStorage = function () {
        if (localStorage.KittymaticPerma) {
            var obj = localStorage.KittymaticPerma.split(";");
            var permanentObject = JSON.parse(obj[0]);

            for (var k in permanentObject.settings) {
                Kittymatic.settings[k] = permanentObject.settings[k];
            }
            Kittymatic.consumablesRemoved = permanentObject.consumablesRemoved;
            Kittymatic.customSets = permanentObject.customSets;
            if (permanentObject.jobPoints) {
                Kittymatic.jobPoints = permanentObject.jobPoints;
                Kittymatic.jobPointsLoaded = true;
            }
            if (permanentObject.lastLevel)
                Kittymatic.lastLevel = permanentObject.lastLevel;

            if (permanentObject.version && permanentObject.subversion) {
                Kittymatic.Changelog.compareVersion(permanentObject.version, permanentObject.subversion);
            }
            else
                Kittymatic.Changelog.compareVersion(10, 15); //Introducing version of changelogs
        }
        else Kittymatic.Changelog.compareVersion(10, 15);
    }

    Kittymatic.getTemporaryInStorage = function () {
        if (localStorage.KittymaticTemp) {
            var obj = localStorage.KittymaticTemp.split(";");
            var tempObject = JSON.parse(obj[0]);
            if (new Date().valueOf() <= tempObject.expiry) {


                var tmpAddedJobs = tempObject.addedJobs;
                for (var j = 0; j < tmpAddedJobs.length; j++) {
                    var jobP = new JobPrototype(tmpAddedJobs[j].x, tmpAddedJobs[j].y, tmpAddedJobs[j].id);
                    jobP.setSilver(tmpAddedJobs[j].silver);
                    jobP.distance = tmpAddedJobs[j].distance;
                    jobP.setExperience(tmpAddedJobs[j].experience);
                    jobP.setMoney(tmpAddedJobs[j].money);
                    jobP.setMotivation(tmpAddedJobs[j].motivation);
                    jobP.setStopMotivation(tmpAddedJobs[j].stopMotivation);
                    jobP.setSet(tmpAddedJobs[j].set);
                    Kittymatic.addedJobs.push(jobP);
                }
                Kittymatic.travelSet = tempObject.travelSet;
                Kittymatic.jobSet = tempObject.jobSet;
                Kittymatic.healthSet = tempObject.healthSet;
                Kittymatic.currentJob = tempObject.currentJob;
                Kittymatic.setSetForAllJobs();
            }
        }
    }


    Kittymatic.setStorage = function () {
        Kittymatic.setStatisticsInStorage();
        Kittymatic.setPermanentInStorage();
        Kittymatic.setTemporaryInStorage();

    };
    Kittymatic.getStorage = function () {
        Kittymatic.delCookies();
        Kittymatic.getTemporaryInStorage();
        Kittymatic.getPermanentInStorage();
        Kittymatic.getStatisticsInStorage();

        if (!Kittymatic.customSets)
            Kittymatic.customSets = [];
    };


    Kittymatic.Changelog.getFullChangelog = function (currentVersion, currentSubversion) {
        var changelog = [];

        var version = currentVersion;
        var subversion = currentSubversion;


        while (true) {
            while (true) {
                subversion++;
                var log = Kittymatic.Changelog.getVersionLog(version, subversion);
                if (log == null)
                    break;
                else changelog.push(log);
            }
            version++;
            subversion = 0;
            var log = Kittymatic.Changelog.getVersionLog(version, subversion);
            if (log == null)
                break;
            else changelog.push(log);
        }
        return changelog;
    }

    Kittymatic.Changelog.getVersionLog = function (version, subversion) {

        switch (version) {
            case 10: {
                switch (subversion) {
                    case 16: {
                        return {
                            title: "Version 1.0.16 - 2023. December 06.",
                            changes: [
                                "Added changelogs to show the user what has changed in Kittymatic.",
                                "Changed Kittymatic's deep cloning method to support browsers that are not using 2023 JavaScript standards.",
                                "Added an option in the Settings tab to enable/disable constant consumable usage. This would enable/disable if Kittymatic should try to use consumables whenever consumable cooldown is not in effect.",
                                "Added an option in the Settings tab to change how much waste is acceptable when using consumables during runtime",
                                "Rearranged some items in the Settings tab",
                                "Changed Kittymatic's way of choosing consumables during runtime to favor health and motivation fillers better.",
                                "Stop motivation for jobs now cannot be set to be 100 or higher."
                            ]
                        }
                    }
                    case 17: {
                        return {
                            title: "Version 1.0.17 - 2023. December 07.",
                            changes: [
                                "Fixed a bug where Kittymatic would stop and alert that it can't continue because of energy/motivation when trying to use consumables.",
                                "Jobs tab now shows money and exp values using the best gear's labor points and the currently worn set. The values might differ if you use a different job set, or if you can't dress into your job set."
                            ]
                        }
                    }
                    case 18: {
                        return {
                            title: "Version 1.0.18 - 2023. December 08.",
                            changes: [
                                "Changed the way of how persistent data is stored. This may result in missing custom sets, statistics, settings, and added jobs. We are very sorry.",
                                "Because of that, we fixed the bug that may break The-West if having too many custom sets or jobs added.",
                                "Also, now the player is able to add nearly an infinite amount of custom sets, and jobs without causing problems.",
                                "Changing jobs in the Chosen Jobs tab now won't refresh the page."
                            ]
                        }
                    }
                    case 19: {
                        return {
                            title: "Version 1.0.19 - 2023. December 11.",
                            changes: [
                                "Fixed a bug where Kittymatic crashed after using a motivation consumable when all the motivations were at the stop value.",
                                "Kittymatic from now will work off the gained motivation after using a motivation consumable, instead of moving to the next place.",
                                "Fixed joblist sorting bug when the player clicked on the name, xp, money, motivation or distance value of a job.",
                                "Now the sorting arrow icon is at the right place when the player sorts the joblist by jobname."
                            ]
                        }
                    }

                    case 20: {
                        return {
                            title: "Version 1.0.20 - 2023. December 31.",
                            changes: [
                                "Optimized walk-to-job job selection to prioritize jobs that have enough job points in travel set, when the main job is unreachable in travel set.",
                                "Statistics now track the highest priced item found in the current session and all-time.",
                                "Reduced the gap between some of the elements in Settings menu.",
                                "Fixed Work as a traveling merchant job showing more money than it could earn.",
                                "Happy New Year!"
                            ]
                        }
                    }
                }
            }
        }

        return null;
    }

    Kittymatic.Changelog.compareVersion = function (version, subversion) {
        Kittymatic.log("Kittymatic.compareVersion");

        if (Kittymatic.version != version || Kittymatic.subversion != subversion) {
            Kittymatic.createChangelogWindow(version, subversion);
        }
    }

    Kittymatic.createChangelogWindow = function (version, subversion) {
        var changelogWindow = wman.open("KittymaticChangelogWindow", "Kittymatic Changelogs").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("Kittymatic Changelogs");
        var content = $('<div class=\'KittymaticChangelogWindow\'/>');
        Kittymatic.changelogWindow = changelogWindow;

        const scrollPane = new west.gui.Scrollpane();

        const setTitle = function (title, i) {
            scrollPane.appendContent(
                `<h3 class="changelog_title${i}" style="border-bottom: 1px solid black;"> ${title} </h3>`,
            );
        };

        var logs = Kittymatic.Changelog.getFullChangelog(version, subversion);

        for (var i = logs.length - 1; i >= 0; i--) {
            setTitle(logs[i].title, i);

            var changes = logs[i].changes;
            var logMessage = '<ul id="lm' + i + '"style="margin-left:15px;line-height:18px;">';

            for (var j = 0; j < changes.length; j++) {
                logMessage += '<li>' + changes[j] + '</li>';
            }
            scrollPane.appendContent(logMessage);
        }

        changelogWindow.appendToContentPane(scrollPane.getMainDiv());

        var addClick = function (i) {
            $(".changelog_title" + i).on("click", function () {
                var ul = document.getElementById("lm" + i);

                if (ul.style.display == "none") {
                    ul.style.display = "block";
                    $(".changelog_title" + i).css({ "font-size": "18px" });

                }
                else {
                    ul.style.display = "none"
                    $(".changelog_title" + i).css({ "font-size": "20px" });
                }
            });

            $(".changelog_title" + i).on("mouseover", function () {
                var ul = document.getElementById("lm" + i);

                $(".changelog_title" + i).css({ "opacity": "0.8" });

            });

            $(".changelog_title" + i).on("mouseleave", function () {
                var ul = document.getElementById("lm" + i);

                $(".changelog_title" + i).css({ "opacity": "1" });

            });
        }

        for (var i = 0; i < logs.length; i++) {
            addClick(i);
        }
    }

    Kittymatic.tabLogic = function (win, id) {
        var content = $('<div class=\'Kittymaticwindow\'/>');

        if (id === "jobs" && !Kittymatic.jobPointsLoaded) {
            new UserMessage("Some jobs are still loading...", UserMessage.TYPE_ERROR).show();
            return;
        }

        switch (id) {
            case "jobs":
                Kittymatic.loadJobData(function () {
                    Kittymatic.removeActiveTab(this);
                    Kittymatic.removeWindowContent();
                    Kittymatic.addActiveTab("jobs", this);
                    content.append(Kittymatic.createJobsTab());
                    Kittymatic.window.appendToContentPane(content);
                    Kittymatic.addJobTableCss();
                    $(".Kittymaticwindow .tw2gui_scrollpane_clipper_contentpane").css({ "top": Kittymatic.jobTablePosition.content });
                    $(".Kittymaticwindow .tw2gui_scrollbar_pulley").css({ "top": Kittymatic.jobTablePosition.scrollbar });
                    Kittymatic.addEventsHeader();
                    Kittymatic.closeCustomSetWindow();
                });
                break;
            case "chosenJobs":
                Kittymatic.removeActiveTab(this);
                Kittymatic.removeWindowContent();
                Kittymatic.addActiveTab("chosenJobs", this);
                content.append(Kittymatic.createAddedJobsTab());
                Kittymatic.window.appendToContentPane(content);
                $(".Kittymaticwindow .tw2gui_scrollpane_clipper_contentpane").css({ "top": Kittymatic.addedJobTablePosition.content });
                $(".Kittymaticwindow .tw2gui_scrollbar_pulley").css({ "top": Kittymatic.addedJobTablePosition.scrollbar });
                Kittymatic.addAddedJobsTableCss();
                Kittymatic.closeCustomSetWindow();
                break;
            case "consumables":
                Kittymatic.removeActiveTab(this);
                Kittymatic.removeWindowContent();
                Kittymatic.addActiveTab("consumables", this);
                Kittymatic.findAllConsumables();
                content.append(Kittymatic.createConsumablesTable());
                Kittymatic.window.appendToContentPane(content);
                $(".Kittymaticwindow .tw2gui_scrollpane_clipper_contentpane").css({ "top": Kittymatic.consumableTablePosition.content });
                $(".Kittymaticwindow .tw2gui_scrollbar_pulley").css({ "top": Kittymatic.consumableTablePosition.scrollbar });
                Kittymatic.addConsumableTableCss();
                Kittymatic.closeCustomSetWindow();
                break;
            case "sets":
                Kittymatic.loadSets(function () {
                    Kittymatic.removeActiveTab(this);
                    Kittymatic.removeWindowContent();
                    Kittymatic.addActiveTab("sets", this);
                    content.append(Kittymatic.createSetGui())
                    Kittymatic.window.appendToContentPane(content);
                    Kittymatic.openCustomSetsPanel();
                    if (Kittymatic.selectedSet >= 0) {
                        Kittymatic.addEquipSetButton();
                    }
                });
                break;
            case "stats":
                Kittymatic.removeActiveTab(this);
                Kittymatic.removeWindowContent();
                Kittymatic.addActiveTab("stats", this);
                content.append(Kittymatic.createStatisticsGui());
                Kittymatic.window.appendToContentPane(content);
                Kittymatic.closeCustomSetWindow();
                break;
            case "settings":
                Kittymatic.removeActiveTab(this);
                Kittymatic.removeWindowContent();
                Kittymatic.addActiveTab("settings", this);
                content.append(Kittymatic.createSettingsGui());
                Kittymatic.window.appendToContentPane(content);
                Kittymatic.closeCustomSetWindow();
                break;
        }
    }
    Kittymatic.createWindow = function () {
        var window = wman.open("Kittymatic").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("Kittymatic");
        var content = $('<div class=\'Kittymaticwindow\'/>');
        var tabs = {
            "jobs": "Jobs",
            "chosenJobs": "Chosen jobs",
            "sets": "Sets",
            "consumables": "Consumables",
            "stats": "Statistics",
            "settings": "Settings"
        };

        for (var tab in tabs) {
            window.addTab(tabs[tab], tab, Kittymatic.tabLogic);
        }
        Kittymatic.window = window;
        Kittymatic.selectTab("chosenJobs");
    };
    Kittymatic.selectTab = function (key) {
        Kittymatic.window.tabIds[key].f(Kittymatic.window, key);
    };
    Kittymatic.removeActiveTab = function (window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active');
    };
    Kittymatic.addActiveTab = function (key, window) {
        $('div._tab_id_' + key, window.divMain).addClass('tw2gui_window_tab_active');
    };
    Kittymatic.removeWindowContent = function () {
        $(".Kittymaticwindow").remove();
    };
    Kittymatic.addJobTableCss = function () {
        $(".Kittymaticwindow .jobIcon").css({ "width": "80px" });
        $(".Kittymaticwindow .jobName").css({ "width": "150px" });
        $(".Kittymaticwindow .jobXp").css({ "width": "40px" });
        $(".Kittymaticwindow .jobMoney").css({ "width": "40px" });
        $(".Kittymaticwindow .jobMotivation").css({ "width": "40px" });
        $(".Kittymaticwindow .jobDistance").css({ "width": "100px" });
        $(".Kittymaticwindow .row").css({ "height": "60px" });
        $('.Kittymaticwindow').find('.tw2gui_scrollpane').css('height', '250px');
    };
    Kittymatic.addAddedJobsTableCss = function () {
        $(".Kittymaticwindow .jobIcon").css({ "width": "80px" });
        $(".Kittymaticwindow .jobName").css({ "width": "130px" });
        $(".Kittymaticwindow .jobStopMotivation").css({ "width": "110px" });
        $(".Kittymaticwindow .jobRemove").css({ "width": "105px" });
        $(".Kittymaticwindow .jobSet").css({ "width": "100px" });
        $(".Kittymaticwindow .row").css({ "height": "60px" });
        $('.Kittymaticwindow').find('.tw2gui_scrollpane').css('height', '250px');
    };
    Kittymatic.addConsumableTableCss = function () {
        $(".Kittymaticwindow .consumIcon").css({ "width": "80px" });
        $(".Kittymaticwindow .consumName").css({ "width": "120px" });
        $(".Kittymaticwindow .consumCount").css({ "width": "70px" });
        $(".Kittymaticwindow .consumEnergy").css({ "width": "70px" });
        $(".Kittymaticwindow .consumMotivation").css({ "width": "70px" });
        $(".Kittymaticwindow .consumHealth").css({ "width": "70px" });
        $(".Kittymaticwindow .row").css({ "height": "80px" });
        $('.Kittymaticwindow').find('.tw2gui_scrollpane').css('height', '250px');
    };
    Kittymatic.addEventsHeader = function () {

        let jobXpElements = document.querySelectorAll(".jobXp");
        let jobDistanceElements = document.querySelectorAll(".jobDistance");
        let jobMoneyElements = document.querySelectorAll(".jobMoney");
        let jobMotivationElements = document.querySelectorAll(".jobMotivation");
        let jobNameElements = document.querySelectorAll(".jobName");

        for(let i = 1; i < jobXpElements.length; i++)
        {
            jobXpElements[i].classList.remove("jobXp");
            jobDistanceElements[i].classList.remove("jobDistance");
            jobMoneyElements[i].classList.remove("jobMoney");
            jobMotivationElements[i].classList.remove("jobMotivation");
            jobNameElements[i].classList.remove("jobName");
        }

        $(".Kittymaticwindow .jobXp").click(function () {
            if (Kittymatic.sortJobTableXp == 0) {
                Kittymatic.sortJobTableXp = 1;
            } else {
                (Kittymatic.sortJobTableXp == 1) ? Kittymatic.sortJobTableXp = -1 : Kittymatic.sortJobTableXp = 1;
            }
            Kittymatic.sortJobTableDistance = 0;
            Kittymatic.sortJobTableMoney = 0;
            Kittymatic.sortJobTableName = 0;
            Kittymatic.sortJobTableMotivation = 0;
            Kittymatic.selectTab("jobs");
        });
        $(".Kittymaticwindow .jobDistance").click(function () {
            if (Kittymatic.sortJobTableDistance == 0) {
                Kittymatic.sortJobTableDistance = 1;
            } else {
                (Kittymatic.sortJobTableDistance == 1) ? Kittymatic.sortJobTableDistance = -1 : Kittymatic.sortJobTableDistance = 1;
            }
            Kittymatic.sortJobTableXp = 0;
            Kittymatic.sortJobTableMoney = 0;
            Kittymatic.sortJobTableName = 0;
            Kittymatic.sortJobTableMotivation = 0;
            Kittymatic.selectTab("jobs");
        });
        $(".Kittymaticwindow .jobMoney").click(function () {
            if (Kittymatic.sortJobTableMoney == 0) {
                Kittymatic.sortJobTableMoney = 1;
            } else {
                (Kittymatic.sortJobTableMoney == 1) ? Kittymatic.sortJobTableMoney = -1 : Kittymatic.sortJobTableMoney = 1;
            }
            Kittymatic.sortJobTableDistance = 0;
            Kittymatic.sortJobTableXp = 0;
            Kittymatic.sortJobTableName = 0;
            Kittymatic.sortJobTableMotivation = 0;
            Kittymatic.selectTab("jobs");
        });
        $(".Kittymaticwindow .jobName").click(function () {
            if (Kittymatic.sortJobTableName == 0) {
                Kittymatic.sortJobTableName = 1;
            } else {
                (Kittymatic.sortJobTableName == 1) ? Kittymatic.sortJobTableName = -1 : Kittymatic.sortJobTableName = 1;
            }
            Kittymatic.sortJobTableDistance = 0;
            Kittymatic.sortJobTableXp = 0;
            Kittymatic.sortJobTableMoney = 0;
            Kittymatic.sortJobTableMotivation = 0;
            Kittymatic.selectTab("jobs");
        });
        $(".Kittymaticwindow .jobMotivation").click(function () {
            if (Kittymatic.sortJobTableMotivation == 0) {
                Kittymatic.sortJobTableMotivation = 1;
            } else {
                (Kittymatic.sortJobTableMotivation == 1) ? Kittymatic.sortJobTableMotivation = -1 : Kittymatic.sortJobTableMotivation = 1;
            }
            Kittymatic.sortJobTableDistance = 0;
            Kittymatic.sortJobTableXp = 0;
            Kittymatic.sortJobTableMoney = 0;
            Kittymatic.sortJobTableName = 0;
            Kittymatic.selectTab("jobs");
        });
    };
    Kittymatic.createJobsTab = function () {
        var htmlSkel = $("<div id = \'jobs_overview'\></div>");
        var html = $("<div class = \'jobs_search'\ style=\'position:relative;'\><div id=\'jobFilter'\style=\'position:absolute;top:0px;left:15px'\></div><div id=\'job_only_silver'\style=\'position:absolute;top:10px;left:200px;'\></div><div id=\'job_no_silver'\style=\'position:absolute;top:10px;left:270px;'\></div><div id=\'job_center'\style=\'position:absolute;top:10px;left:350px;'\></div><div id=\'button_filter_jobs'\style=\'position:absolute;top:35px;left:50px;'\></div></div>");
        var table = new west.gui.Table();
        var xpIcon = '<img src="/images/icons/star.png">';
        var dollarIcon = '<img src="/images/icons/dollar.png">';
        var motivationIcon = '<img src="/images/icons/motivation.png">';
        var arrow_desc = '&nbsp;<img src="../images/window/jobs/sortarrow_desc.png"/>';
        var arrow_asc = '&nbsp;<img src="../images/window/jobs/sortarrow_asc.png"/>';
        var uniqueJobs = Kittymatic.getAllUniqueJobs();
        table.addColumn("jobIcon", "jobIcon").addColumn("jobName", "jobName").addColumn("jobXp", "jobXp").addColumn("jobMoney", "jobMoney").addColumn("jobMotivation", "jobMotivation").addColumn("jobDistance", "jobDistance").addColumn("jobAdd", "jobAdd");
        table.appendToCell("head", "jobIcon", "Job icon").appendToCell("head", "jobName", "Job name" + (Kittymatic.sortJobTableName == 1 ? arrow_asc : Kittymatic.sortJobTableName == -1 ? arrow_desc : "")).appendToCell("head", "jobXp", xpIcon + (Kittymatic.sortJobTableXp == 1 ? arrow_asc : Kittymatic.sortJobTableXp == -1 ? arrow_desc : "")).appendToCell("head", "jobMoney", dollarIcon + (Kittymatic.sortJobTableMoney == 1 ? arrow_asc : Kittymatic.sortJobTableMoney == -1 ? arrow_desc : "")).appendToCell("head", "jobMotivation", motivationIcon + (Kittymatic.sortJobTableMotivation == 1 ? arrow_asc : Kittymatic.sortJobTableMotivation == -1 ? arrow_desc : "")).appendToCell("head", "jobDistance", "Distance " + (Kittymatic.sortJobTableDistance == 1 ? arrow_asc : Kittymatic.sortJobTableDistance == -1 ? arrow_desc : "")).appendToCell("head", "jobAdd", "");
        for (var job = 0; job < uniqueJobs.length; job++) {
            if (Kittymatic.markedBig["x-" + uniqueJobs[job].x + "y-" + uniqueJobs[job].y + "id-" + uniqueJobs[job].id]) {
                table.appendRow().appendToCell(-1, "jobIcon", Kittymatic.getJobIcon(uniqueJobs[job].silver, uniqueJobs[job].id, uniqueJobs[job].x, uniqueJobs[job].y)).appendToCell(-1, "jobName", "<p style=\"color: red; \">" + Kittymatic.getJobName(uniqueJobs[job].id) + "</p").appendToCell(-1, "jobXp", uniqueJobs[job].experience).appendToCell(-1, "jobMoney", uniqueJobs[job].money).appendToCell(-1, "jobMotivation", uniqueJobs[job].motivation).appendToCell(-1, "jobDistance", uniqueJobs[job].distance.formatDuration()).appendToCell(-1, "jobAdd", Kittymatic.createAddJobButton(uniqueJobs[job].x, uniqueJobs[job].y, uniqueJobs[job].id));
            } else {
                table.appendRow().appendToCell(-1, "jobIcon", Kittymatic.getJobIcon(uniqueJobs[job].silver, uniqueJobs[job].id, uniqueJobs[job].x, uniqueJobs[job].y)).appendToCell(-1, "jobName", Kittymatic.getJobName(uniqueJobs[job].id)).appendToCell(-1, "jobXp", uniqueJobs[job].experience).appendToCell(-1, "jobMoney", uniqueJobs[job].money).appendToCell(-1, "jobMotivation", uniqueJobs[job].motivation).appendToCell(-1, "jobDistance", uniqueJobs[job].distance.formatDuration()).appendToCell(-1, "jobAdd", Kittymatic.createAddJobButton(uniqueJobs[job].x, uniqueJobs[job].y, uniqueJobs[job].id));
            }
        }

        var textfield = new west.gui.Textfield("jobsearch").setPlaceholder("Select job name");
        if (Kittymatic.jobFilter.filterJob != "") {
            textfield.setValue(Kittymatic.jobFilter.filterJob);
        }
        var checkboxOnlySilver = new west.gui.Checkbox();
        checkboxOnlySilver.setLabel("Silvers");
        checkboxOnlySilver.setSelected(Kittymatic.jobFilter.filterOnlySilver);
        checkboxOnlySilver.setCallback(function () {
            if (this.isSelected()) {
                Kittymatic.jobFilter.filterOnlySilver = true;
            } else {
                Kittymatic.jobFilter.filterOnlySilver = false;
            }
        });
        var checkboxNoSilver = new west.gui.Checkbox();
        checkboxNoSilver.setLabel("No silvers");
        checkboxNoSilver.setSelected(Kittymatic.jobFilter.filterNoSilver);
        checkboxNoSilver.setCallback(function () {
            if (this.isSelected()) {
                Kittymatic.jobFilter.filterNoSilver = true;
            } else {
                Kittymatic.jobFilter.filterNoSilver = false;
            }
        });
        var checkboxCenterJobs = new west.gui.Checkbox();
        checkboxCenterJobs.setLabel("Center jobs");
        checkboxCenterJobs.setSelected(Kittymatic.jobFilter.filterCenterJobs);
        checkboxCenterJobs.setCallback(function () {
            if (this.isSelected()) {
                Kittymatic.jobFilter.filterCenterJobs = true;
            } else {
                Kittymatic.jobFilter.filterCenterJobs = false;
            }
        });

        var checkboxLargeJobs = new west.gui.Checkbox();
        checkboxLargeJobs.setLabel("Show too big jobs");
        checkboxLargeJobs.setSelected(Kittymatic.jobFilter.filterShowLargeJobs);
        checkboxLargeJobs.setCallback(function () {
            if (this.isSelected()) {
                Kittymatic.jobFilter.filterShowLargeJobs = true;
            } else {
                Kittymatic.jobFilter.filterShowLargeJobs = false;
            }
        });

        var buttonFilter = new west.gui.Button("Filter", function () {
            Kittymatic.jobFilter.filterJob = textfield.getValue();
            Kittymatic.jobTablePosition.content = "0px";
            Kittymatic.jobTablePosition.scrollbar = "0px";
            Kittymatic.selectTab("jobs");
        });
        htmlSkel.append(table.getMainDiv());
        $('#jobFilter', html).append(textfield.getMainDiv());
        $("#job_only_silver", html).append(checkboxOnlySilver.getMainDiv());
        $("#job_no_silver", html).append(checkboxNoSilver.getMainDiv());
        $("#job_center", html).append(checkboxCenterJobs.getMainDiv());
        $("#job_center", html).append(checkboxLargeJobs.getMainDiv());
        $("#button_filter_jobs", html).append(buttonFilter.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };
    Kittymatic.createAddJobButton = function (x, y, id) {
        var buttonAdd = new west.gui.Button("Add new job", function () {
            Kittymatic.addJob(x, y, id);
            Kittymatic.jobTablePosition.content = $(".Kittymaticwindow .tw2gui_scrollpane_clipper_contentpane").css("top");
            Kittymatic.jobTablePosition.scrollbar = $(".Kittymaticwindow .tw2gui_scrollbar_pulley").css("top");
            Kittymatic.selectTab("jobs");
        });
        buttonAdd.setWidth(100);
        return buttonAdd.getMainDiv();
    };
    Kittymatic.createAddedJobsTab = function () {
        var htmlSkel = $("<div id=\'added_jobs_overview'\></div>");
        var footerHtml = $("<div id=\'start_Kittymatic'\ style=\'position:relative;'\><span class =\'Kittymatic_state'\ style=\' position:absolute;left:20px; top:10px; font-family: Arial, Helvetica, sans-serif; font-size: 15px;font-weight: bold;'\> Current state:" + Kittymatic.states[Kittymatic.currentState] + "</span><div class = \'Kittymatic_run'\ style = \'position:absolute; left:350px; top:20px;'\></div></div>");
        var table = new west.gui.Table();
        table.addColumn("jobIcon", "jobIcon").addColumn("jobName", "jobName").addColumn("jobStopMotivation", "jobStopMotivation").addColumn("jobSet", "jobSet").addColumn("jobRemove", "jobRemove");
        table.appendToCell("head", "jobIcon", "Job icon").appendToCell("head", "jobName", "Job name").appendToCell("head", "jobStopMotivation", "Stop motivation").appendToCell("head", "jobSet", "Job set").appendToCell("head", "jobRemove", "");
        for (var job = 0; job < Kittymatic.addedJobs.length; job++) {
            table.appendRow().appendToCell(-1, "jobIcon", Kittymatic.getJobIcon(Kittymatic.addedJobs[job].silver, Kittymatic.addedJobs[job].id, Kittymatic.addedJobs[job].x, Kittymatic.addedJobs[job].y)).appendToCell(-1, "jobName", Kittymatic.getJobName(Kittymatic.addedJobs[job].id)).appendToCell(-1, "jobStopMotivation", Kittymatic.createMinMotivationTextfield(Kittymatic.addedJobs[job].x, Kittymatic.addedJobs[job].y, Kittymatic.addedJobs[job].id, Kittymatic.addedJobs[job].stopMotivation)).appendToCell(-1, "jobSet", Kittymatic.createComboxJobSets(Kittymatic.addedJobs[job].x, Kittymatic.addedJobs[job].y, Kittymatic.addedJobs[job].id)).appendToCell(-1, "jobRemove", Kittymatic.createRemoveJobButton(Kittymatic.addedJobs[job].x, Kittymatic.addedJobs[job].y, Kittymatic.addedJobs[job].id));
        }
        var buttonStart = new west.gui.Button("Start", function () {
            var parseSuccessful = Kittymatic.parseStopMotivation();
            if (parseSuccessful) {
                if (!Kittymatic.isRunning) {
                    Kittymatic.tryWarnUser();
                    Kittymatic.createRoute();
                    Kittymatic.isRunning = true;
                    Kittymatic.setStorage();
                    Kittymatic.run();
                    Kittymatic.selectTab("chosenJobs");
                }
            } else {
                new UserMessage("Wrong format of set stop motivation", UserMessage.TYPE_ERROR).show();
            }
        });
        var buttonStop = new west.gui.Button("Stop", function () {
            Kittymatic.isRunning = false;
            Kittymatic.currentState = 0;
            Kittymatic.selectTab("chosenJobs");
            Kittymatic.cancelJobs();
        });
        htmlSkel.append(table.getMainDiv());
        $(".Kittymatic_run", footerHtml).append(buttonStart.getMainDiv());
        $(".Kittymatic_run", footerHtml).append(buttonStop.getMainDiv());
        htmlSkel.append(footerHtml);
        return htmlSkel;
    };
    Kittymatic.createMinMotivationTextfield = function (x, y, id, placeholder) {
        var componentId = "x-" + x + "y-" + y + "id-" + id;
        var textfield = new west.gui.Textfield();
        textfield.setId(componentId);
        textfield.setWidth(40);
        textfield.setValue(placeholder);
        return textfield.getMainDiv();
    };
    Kittymatic.createRemoveJobButton = function (x, y, id) {
        var buttonRemove = new west.gui.Button("Remove job", function () {
            Kittymatic.removeJob(x, y, id);
            Kittymatic.addedJobTablePosition.content = $(".Kittymaticwindow .tw2gui_scrollpane_clipper_contentpane").css("top");
            Kittymatic.addedJobTablePosition.scrollbar = $(".Kittymaticwindow .tw2gui_scrollbar_pulley").css("top");
            Kittymatic.selectTab("chosenJobs");
        });
        buttonRemove.setWidth(100);
        return buttonRemove.getMainDiv();
    };
    Kittymatic.createComboxJobSets = function (x, y, id) {
        var combobox = new west.gui.Combobox();
        Kittymatic.addComboboxItems(combobox);
        combobox = combobox.select(Kittymatic.getJobSet(x, y, id));
        combobox.setWidth(60);
        combobox.addListener(function (value) {
            Kittymatic.setJobSet(x, y, id, value);
        });
        return combobox.getMainDiv();
    };


    Kittymatic.addComboboxItems = function (combobox) {
        combobox.addItem(-1, "None");
        for (var i = 0; i < Kittymatic.sets.length; i++) {
            combobox.addItem(i.toString(), Kittymatic.sets[i].name);
        }
        for (var i = 0; i < Kittymatic.customSets.length; i++) {
            idx = 20 + i;
            combobox.addItem(idx.toString(), Kittymatic.getCustomSetName(i));
        }
    };
    Kittymatic.createCustomSetnameTextfield = function (placeholder) {

        var htmlSetName = $("<div></div>");
        htmlSetName.append("<span> Set name: </span>");
        var setNameTextfield = new west.gui.Textfield("kittymaticSetName");

        var index = Kittymatic.selectedSet - 20;
        if (index < 0 || index >= Kittymatic.customSets.length) {
            setNameTextfield.setValue("");
        }
        else {
            setNameTextfield.setValue(Kittymatic.getCustomSetName(index));
        }
        setNameTextfield.setWidth(200);
        htmlSetName.append(setNameTextfield.getMainDiv());

        return htmlSetName;
    };


    Kittymatic.createCustomSetWindow = function () {
        var index = Kittymatic.selectedSet - 20;

        var htmlSkel = $("<div id=\'custom_sets_overview'\></div>");
        setname = "";
        if (index < 0 || index >= Kittymatic.customSets.length) {
            setname = "Not a custom set";
        }
        else {
            setname = Kittymatic.getCustomSetName(index);
        }

        var topHtml = $("<div id=\'start_KittymaticCustom'\ style=\'position:relative; top:-25px; left:0px;'\><span class =\'KittymaticCustom_state'\ style=\' position:absolute;left:20px; top:10px; font-family: Arial, Helvetica, sans-serif; font-size: 15px;font-weight: bold;'\> Current custom set: " + setname + "</span><div class = \'KittymaticCustom_run'\ style = \'position:absolute; left:350px; top:20px;'\></div></div>");
        var footerHtml = $("<div id=\'start_KittymaticCustom'\ style=\'position:relative;'\><span class =\'KittymaticCustom_state'\ style=\' position:absolute;left:20px; top:10px; font-family: Arial, Helvetica, sans-serif; font-size: 15px;font-weight: bold;'\></span><div class = \'KittymaticCustom_run'\ style = \'position:absolute; left:0px; top:20px;'\></div></div>");
        htmlSkel.append(topHtml);
        htmlSkel.append(Kittymatic.createCustomSetnameTextfield());

        var buttonAdd = new west.gui.Button("Add new set", function () {
            var setName = document.getElementById("kittymaticSetName").value;
            Kittymatic.selectedSet = 20 + Kittymatic.customSets.length;
            Kittymatic.addCustomSet(setName);
            Kittymatic.tabLogic(Kittymatic.window, "sets");
            Kittymatic.reloadCustomSetWindow();
            Kittymatic.setStorage();
        });
        var buttonRemove = new west.gui.Button("Remove set", function () {
            Kittymatic.removeCustomSet(index);
            Kittymatic.tabLogic(Kittymatic.window, "sets");
            Kittymatic.reloadCustomSetWindow();
            Kittymatic.setStorage();
        });
        var buttonModify = new west.gui.Button("Modify set", function () {
            Kittymatic.modifyCustomSet(index);
            Kittymatic.tabLogic(Kittymatic.window, "sets");
            Kittymatic.reloadCustomSetWindow();
            Kittymatic.setStorage();
        });
        var buttonModifyName = new west.gui.Button("Modify name", function () {
            var setName = document.getElementById("kittymaticSetName").value;
            Kittymatic.modifyCustomSetName(index, setName);
            Kittymatic.tabLogic(Kittymatic.window, "sets");
            Kittymatic.reloadCustomSetWindow();
            Kittymatic.setStorage();
        });

        $(".KittymaticCustom_run", footerHtml).append(buttonAdd.getMainDiv());
        if (!(index < 0 || index >= Kittymatic.customSets.length)) {
            $(".KittymaticCustom_run", footerHtml).append(buttonRemove.getMainDiv());
            $(".KittymaticCustom_run", footerHtml).append(buttonModify.getMainDiv());
            $(".KittymaticCustom_run", footerHtml).append(buttonModifyName.getMainDiv());
        }
        htmlSkel.append(footerHtml);
        return htmlSkel;
    }

    Kittymatic.reloadCustomSetWindow = function () {
        if (Kittymatic.customSetWindow) {
            $(".KittymaticCustomwindow").remove();
            var content = $('<div class=\'KittymaticCustomwindow\'/>');
            content.append(Kittymatic.createCustomSetWindow());
            Kittymatic.customSetWindow.appendToContentPane(content);
        }
    }

    Kittymatic.closeCustomSetWindow = function () {
        if (Kittymatic.customSetWindow) {
            Kittymatic.customSetWindow.destroy();
            Kittymatic.customSetWindow = null;
        }
    }
    Kittymatic.openCustomSetsPanel = function () {
        const csb = document.getElementById('createSetButton');
        csb.addEventListener('click', () => {
            Kittymatic.customSetWindow = wman.open("KittymaticCustomSets").setResizeable(false).setMinSize(470, 180).setSize(470, 180).setMiniTitle("Kittymatic Custom Setter");
            var content = $('<div class=\'KittymaticCustomwindow\'/>');
            content.append(Kittymatic.createCustomSetWindow());
            Kittymatic.customSetWindow.appendToContentPane(content);
        });
    };

    Kittymatic.addEquipSetButton = function () {
        const esb = document.getElementById('KittymaticEquipSet');
        esb.addEventListener('click', () => {
            Kittymatic.equipSet(Kittymatic.selectedSet);
        });
    }

    Kittymatic.createSetGui = function () {

        if (Kittymatic.selectedSet < 0)
            Kittymatic.selectedSet = -1;
        else if (Kittymatic.selectedSet > Kittymatic.sets.length) {
            if (Kittymatic.selectedSet < 20)
                Kittymatic.selectedSet = -1;
            else if (Kittymatic.selectedSet - 20 >= Kittymatic.customSets.length)
                Kittymatic.selectedSet = -1;
        }
        var htmlSkel = $("<div id =\'Kittymatic_sets_window'\ style=\'display:block;position:relative;width:650px;height:430px;'\><div id=\'Kittymatic_sets_left' style=\'display:block;position:absolute;width:250px;height:430px;top:0px;left:0px'\></div><div id=\'Kittymatic_sets_right' style=\'display:block;position:absolute;width:300px;height:410px;top:0px;left:325px'\></div></div>");
        var combobox = new west.gui.Combobox("combobox_sets");
        Kittymatic.addComboboxItems(combobox);
        combobox = combobox.select(Kittymatic.selectedSet);
        combobox.addListener(function (value) {
            Kittymatic.selectedSet = value;
            Kittymatic.selectTab("sets");
            Kittymatic.reloadCustomSetWindow();
        });
        var buttonSelectTravelSet = new west.gui.Button("Select travel set", function () {
            Kittymatic.travelSet = Kittymatic.selectedSet;
            Kittymatic.selectTab("sets");
        });
        var buttonSelectJobSet = new west.gui.Button("Select job set", function () {

            Kittymatic.jobSet = Kittymatic.selectedSet;
            Kittymatic.setSetForAllJobs();
            Kittymatic.selectTab("sets");
        });
        var buttonSelectHealthSet = new west.gui.Button("Select health set", function () {
            Kittymatic.healthSet = Kittymatic.selectedSet;
            Kittymatic.selectTab("sets");
        });
        var buttonSelectRegenerationSet = new west.gui.Button("Select regeneration set", function () {
            Kittymatic.regenerationSet = Kittymatic.selectedSet;
            Kittymatic.selectTab("sets");
        });
        var travelSetText = "None";
        if (Kittymatic.travelSet != -1 && Kittymatic.travelSet < Kittymatic.sets.length) {
            travelSetText = Kittymatic.sets[Kittymatic.travelSet].name;
        }
        else if (Kittymatic.travelSet != -1) {
            idx = (Kittymatic.travelSet - 20);
            if (idx >= 0 && idx < Kittymatic.customSets.length)
                travelSetText = Kittymatic.getCustomSetName(idx);
        }
        var jobSetText = "None";
        if (Kittymatic.jobSet != -1 && Kittymatic.jobSet < Kittymatic.sets.length) {
            jobSetText = Kittymatic.sets[Kittymatic.jobSet].name;
        }
        else if (Kittymatic.jobSet != -1) {
            idx = (Kittymatic.jobSet - 20);
            if (idx >= 0 && idx < Kittymatic.customSets.length)
                jobSetText = Kittymatic.getCustomSetName(idx);
        }
        var healthSetText = "None";
        if (Kittymatic.healthSet != -1 && Kittymatic.healthSet < Kittymatic.sets.length) {
            healthSetText = Kittymatic.sets[Kittymatic.healthSet].name;
        }
        else if (Kittymatic.healthSet != -1) {
            idx = (Kittymatic.healthSet - 20);
            if (idx >= 0 && idx < Kittymatic.customSets.length)
                healthSetText = Kittymatic.getCustomSetName(idx);
        }
        var regenerationSetText = "None";
        if (Kittymatic.regenerationSet != -1 && Kittymatic.regenerationSet < Kittymatic.sets.length) {
            regenerationSetText = Kittymatic.sets[Kittymatic.regenerationSet].name;
        }
        else if (Kittymatic.regenerationSet != -1) {
            idx = (Kittymatic.regenerationSet - 20);
            if (idx >= 0 && idx < Kittymatic.customSets.length)
                regenerationSetText = Kittymatic.getCustomSetName(idx);
        }

        Kittymatic.leftFunction = function () {
            if (Kittymatic.selectedSet == -1) {
                return $("<div></div>").append(new west.gui.Groupframe().appendToContentPane($("<span>Sets</span><br><br>")).appendToContentPane(combobox.getMainDiv()).appendToContentPane($("<br><br><span>Travel set:" + travelSetText + "</span><br><br>")).appendToContentPane(buttonSelectTravelSet.getMainDiv()).appendToContentPane($("<br><br><span>Job set:" + jobSetText + "</span><br><br>")).appendToContentPane(buttonSelectJobSet.getMainDiv()).appendToContentPane($("<br><br><span>Health set:" + healthSetText + "</span><br><br>")).appendToContentPane(buttonSelectHealthSet.getMainDiv()).appendToContentPane($("<br><br><span>Regeneration set:" + regenerationSetText + "</span><br><br>")).appendToContentPane(buttonSelectRegenerationSet.getMainDiv()).getMainDiv());
            }
            else {
                return $("<div></div>").append(new west.gui.Groupframe().appendToContentPane($("<span>Sets</span><br><br>")).appendToContentPane(combobox.getMainDiv()).appendToContentPane($("<a id='KittymaticEquipSet'\ style='display: inline; padding-left: 5px;'>Equip</a><br><br><span>Travel set:" + travelSetText + "</span><br><br>")).appendToContentPane(buttonSelectTravelSet.getMainDiv()).appendToContentPane($("<br><br><span>Job set:" + jobSetText + "</span><br><br>")).appendToContentPane(buttonSelectJobSet.getMainDiv()).appendToContentPane($("<br><br><span>Health set:" + healthSetText + "</span><br><br>")).appendToContentPane(buttonSelectHealthSet.getMainDiv()).appendToContentPane($("<br><br><span>Regeneration set:" + regenerationSetText + "</span><br><br>")).appendToContentPane(buttonSelectRegenerationSet.getMainDiv()).getMainDiv());
            }
        }

        var left = Kittymatic.leftFunction();
        var right = $("<div style=\'display:block;position:relative;width:300px;height:410px;'\></div>");
        //create set button
        right.append("<div class='tw2gui_button'\ id='createSetButton'\ style='left: 130px;'><div class='tw2gui_button_right_cap'></div><div class='tw2gui_button_left_cap'></div><div class='tw2gui_button_middle_bg'></div><div class='textart_title'>Create new set</div></div>");
        //head div
        right.append("<div class=\'wear_head wear_slot'\ style=\'display:block;position:absolute;left:30px;top:1px;width:93px;height:94px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position: -95px 0;'\></div>");
        //chest div
        right.append("<div class=\'wear_body wear_slot'\ style=\'display:block;position:absolute;left:30px;top:106px;width:95px;height:138px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:0 0;'\></div>");
        //pants div
        right.append("<div class=\'wear_pants wear_slot'\ style=\'display:block;position:absolute;left:30px;top:258px;width:93px;height:138px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:0 0;'\></div>");
        //neck div
        right.append("<div class=\'wear_neck wear_slot'\ style=\'display:block;position:absolute;left:-47px;top:1px;width:74px;height:74px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:-189px 0;'\></div>");
        //right arm div
        right.append("<div class=\'wear_right_arm wear_slot'\ style=\'display:block;position:absolute;left:-64px;top:79px;width:95px;height:138px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:0 0;'\></div>");
        //animal div
        right.append("<div class=\'wear_animal wear_slot'\ style=\'display:block;position:absolute;left:-64px;top:223px;width:93px;height:94px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:-95px 0;'\></div>");
        //yield div
        right.append("<div class=\'wear_yield wear_slot'\ style=\'display:block;position:absolute;left:-47px;top:321px;width:74px;height:74px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:-189px 0;'\></div>");
        //left arm div
        right.append("<div class=\'wear_left_arm wear_slot'\ style=\'display:block;position:absolute;left:127px;top:52px;width:95px;height:138px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:0 0;'\></div>");
        //belt div
        right.append("<div class=\'wear_belt wear_slot'\ style=\'display:block;position:absolute;left:127px;top:200px;width:93px;height:94px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:-95px 0;'\></div>");
        //boots div
        right.append("<div class=\'wear_foot wear_slot'\ style=\'display:block;position:absolute;left:127px;top:302px;width:93px;height:94px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:-95px 0;'\></div>");
        var keys = ["head", "body", "pants", "neck", "right_arm", "animal", "yield", "left_arm", "belt", "foot"];
        if (Kittymatic.selectedSet != -1 && ((Kittymatic.selectedSet < Kittymatic.sets.length) || (Kittymatic.selectedSet >= 20 && Kittymatic.selectedSet - 20 < Kittymatic.customSets.length)))
            Kittymatic.insertSetImages(right, keys);
        $("#Kittymatic_sets_left", htmlSkel).append(left);
        $("#Kittymatic_sets_right", htmlSkel).append(right);
        return htmlSkel;
    };
    Kittymatic.getImageSkel = function () {
        return $("<img src=\''\>");
    };
    Kittymatic.insertSetImages = function (html, keys) {
        for (var i = 0; i < keys.length; i++) {
            idx = Kittymatic.selectedSet - 20;

            if (Kittymatic.selectedSet < Kittymatic.sets.length && Kittymatic.sets[Kittymatic.selectedSet][keys[i]] != null) {
                $(".wear_" + keys[i], html).append(Kittymatic.getImageSkel().attr("src", Kittymatic.getItemImage(Kittymatic.sets[Kittymatic.selectedSet][keys[i]])));
            }
            else if (idx >= 0 && idx < Kittymatic.customSets.length && Kittymatic.customSets[idx][keys[i]] != null) {
                $(".wear_" + keys[i], html).append(Kittymatic.getImageSkel().attr("src", Kittymatic.getItemImage(Kittymatic.customSets[idx][keys[i]])));
            }
        }
        return html;
    };
    Kittymatic.createConsumablesTable = function () {
        var htmlSkel = $("<div id=\'consumables_overview'\></div>");
        var html = $("<div class = \'consumables_filter'\ style=\'position:relative;'\><div id=\'energy_consumables'\style=\'position:absolute;top:10px;left:15px;'\></div><div id=\'motivation_consumables'\style=\'position:absolute;top:10px;left:160px;'\></div><div id=\'health_consumables'\style=\'position:absolute;top:10px;left:320px;'\></div><div id=\'button_filter_consumables'\style=\'position:absolute;top:5px;left:460px;'\></div></div>");
        var table = new west.gui.Table();
        var consumableList = Kittymatic.filterConsumables(Kittymatic.consumableSelection.energy, Kittymatic.consumableSelection.motivation, Kittymatic.consumableSelection.health);
        table.addColumn("consumIcon", "consumIcon").addColumn("consumName", "consumName").addColumn("consumCount", "consumCount").addColumn("consumEnergy", "consumEnergy").addColumn("consumMotivation", "consumMotivation").addColumn("consumHealth", "consumHealth").addColumn("consumSelected", "consumSelected");
        table.appendToCell("head", "consumIcon", "Image").appendToCell("head", "consumName", "Name").appendToCell("head", "consumCount", "Count").appendToCell("head", "consumEnergy", "Energy").appendToCell("head", "consumMotivation", "Motivation").appendToCell("head", "consumHealth", "Health").appendToCell("head", "consumSelected", "Use");
        for (var i = 0; i < consumableList.length; i++) {
            var checkbox = new west.gui.Checkbox();
            checkbox.setSelected(consumableList[i].selected);
            checkbox.setId(consumableList[i].id);
            checkbox.setCallback(function () {
                Kittymatic.changeConsumableSelection(parseInt(this.divMain.attr("id")), this.isSelected());
                Kittymatic.consumableTablePosition.content = $(".Kittymaticwindow .tw2gui_scrollpane_clipper_contentpane").css("top");
                Kittymatic.consumableTablePosition.scrollbar = $(".Kittymaticwindow .tw2gui_scrollbar_pulley").css("top");
                Kittymatic.selectTab("consumables");
                Kittymatic.setStorage();
            });
            table.appendRow().appendToCell(-1, "consumIcon", Kittymatic.getConsumableIcon(consumableList[i].image)).appendToCell(-1, "consumName", consumableList[i].name).appendToCell(-1, "consumCount", consumableList[i].count).appendToCell(-1, "consumEnergy", consumableList[i].energy).appendToCell(-1, "consumMotivation", consumableList[i].motivation).appendToCell(-1, "consumHealth", consumableList[i].health).appendToCell(-1, "consumSelected", checkbox.getMainDiv());
        }
        var buttonSelect = new west.gui.Button("Select all", function () {
            Kittymatic.changeSelectionAllConsumables(true);
            Kittymatic.selectTab("consumables");
            Kittymatic.setStorage();
        });
        var buttonDeselect = new west.gui.Button("Deselect all", function () {
            Kittymatic.changeSelectionAllConsumables(false);
            Kittymatic.selectTab("consumables");
            Kittymatic.setStorage();
        });
        table.appendToFooter("consumEnergy", buttonSelect.getMainDiv());
        table.appendToFooter("consumHealth", buttonDeselect.getMainDiv());
        htmlSkel.append(table.getMainDiv());
        var checkboxEnergyConsumes = new west.gui.Checkbox();
        checkboxEnergyConsumes.setLabel("Energy consumables");
        checkboxEnergyConsumes.setSelected(Kittymatic.consumableSelection.energy);
        checkboxEnergyConsumes.setCallback(function () {
            Kittymatic.consumableSelection.energy = this.isSelected();
        });
        var checkboxMotivationConsumes = new west.gui.Checkbox();
        checkboxMotivationConsumes.setLabel("Motivation consumables");
        checkboxMotivationConsumes.setSelected(Kittymatic.consumableSelection.motivation);
        checkboxMotivationConsumes.setCallback(function () {
            Kittymatic.consumableSelection.motivation = this.isSelected();
        });
        var checkboxHealthConsumes = new west.gui.Checkbox();
        checkboxHealthConsumes.setLabel("Health consumables");
        checkboxHealthConsumes.setSelected(Kittymatic.consumableSelection.health);
        checkboxHealthConsumes.setCallback(function () {
            Kittymatic.consumableSelection.health = this.isSelected();
        });
        var buttonFilter = new west.gui.Button("Select", function () {
            Kittymatic.selectTab("consumables");
        });
        $("#energy_consumables", html).append(checkboxEnergyConsumes.getMainDiv());
        $("#motivation_consumables", html).append(checkboxMotivationConsumes.getMainDiv());
        $("#health_consumables", html).append(checkboxHealthConsumes.getMainDiv());
        $("#button_filter_consumables", html).append(buttonFilter.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };

    Kittymatic.addSleepPlacesItems = function (combobox) {
        combobox.addItem(-2, "None");
        if (Kittymatic.homeTown != null) {
            combobox.addItem(-1, Kittymatic.homeTown.name);
        }
        for (var i = 0; i < Kittymatic.forts.length; i++) {
            var type = (Kittymatic.forts[i].type == 0) ? "Small" : (Kittymatic.forts[i].type == 1) ? "Medium" : "Large";
            combobox.addItem(i.toString(), Kittymatic.forts[i].name + "  -  " + type);
        }
    }

    Kittymatic.createSettingsGui = function () {
        var htmlSkel = $("<div id=\'settings_overview'\ style = \'padding:10px;'\></div>");


        //Use consumables runtime
        var htmlUseConsumables = $("<div></div>");
        var checkboxUseConsumables = new west.gui.Checkbox();
        checkboxUseConsumables.setLabel("Allow constant consumable usage");
        checkboxUseConsumables.setSelected(Kittymatic.settings.useConsumablesRuntime);
        checkboxUseConsumables.setCallback(function () {
            if (this.isSelected()) {
                $("#acceptable_waste_value").css('visibility', 'visible');
            } else {
                $("#acceptable_waste_value").css('visibility', 'hidden');
            }
        });

        htmlUseConsumables.append(checkboxUseConsumables.getMainDiv());

        var htmlAcceptableWaste = $("<div id='acceptable_waste_value'></div>");
        htmlAcceptableWaste.css({ 'display': 'inline-block', 'padding-left': '10px', 'visibility': (Kittymatic.settings.useConsumablesRuntime) ? 'visible' : "hidden" });
        htmlAcceptableWaste.append("<span> Acceptable waste </span>");
        var acceptableWasteTextfield = new west.gui.Textfield("acceptableWaste");
        acceptableWasteTextfield.setValue(Kittymatic.settings.acceptableWaste);
        acceptableWasteTextfield.setWidth(100);
        htmlAcceptableWaste.append(acceptableWasteTextfield.getMainDiv());
        htmlUseConsumables.append(htmlAcceptableWaste);

        //Energy checbkox
        var checkboxAddEnergy = new west.gui.Checkbox();
        checkboxAddEnergy.setLabel("Add energy");
        checkboxAddEnergy.setSelected(Kittymatic.settings.addEnergy);

        //Motivation checkbox
        var checkboxAddMotivation = new west.gui.Checkbox();
        checkboxAddMotivation.setLabel("Add motivation");
        checkboxAddMotivation.setSelected(Kittymatic.settings.addMotivation);

        //Health checkbox
        var checkboxAddHealth = new west.gui.Checkbox();
        checkboxAddHealth.setLabel("Add health");
        checkboxAddHealth.setSelected(Kittymatic.settings.addHealth);

        //Go to bank
        var htmlGoToBank = $("<div></div>");
        var checkboxGoToBank = new west.gui.Checkbox();
        checkboxGoToBank.setLabel("Put money to bank");
        checkboxGoToBank.setSelected(Kittymatic.settings.goToBank);
        checkboxGoToBank.setCallback(function () {
            if (this.isSelected()) {
                $("#money_stop_limit").css('visibility', 'visible');
            } else {
                $("#money_stop_limit").css('visibility', 'hidden');
            }
        });
        htmlGoToBank.append(checkboxGoToBank.getMainDiv());
        var htmlMoneyStop = $("<div id='money_stop_limit'></div>");
        htmlMoneyStop.css({ 'display': 'inline-block', 'padding-left': '10px', 'visibility': (Kittymatic.settings.goToBank) ? 'visible' : "hidden" });
        htmlMoneyStop.append("<span> Money limit </span>");
        var moneyStopTextfield = new west.gui.Textfield("moneyLimit");
        moneyStopTextfield.setValue(Kittymatic.settings.moneyLimit);
        moneyStopTextfield.setWidth(100);
        htmlMoneyStop.append(moneyStopTextfield.getMainDiv());
        htmlGoToBank.append(htmlMoneyStop);

        var htmlHealthStop = $("<div></div>");
        htmlHealthStop.append("<span> Stoppage health value </span>");
        var healthStopTextfiled = new west.gui.Textfield("healthStop");
        healthStopTextfiled.setValue(Kittymatic.settings.healthStop);
        healthStopTextfiled.setWidth(100);
        htmlHealthStop.append(healthStopTextfiled.getMainDiv());



        var htmlSetWearDelay = $("<div></div>");
        htmlSetWearDelay.append("<span> Job set equip delay </span>");
        var setWearDelayTextfiled = new west.gui.Textfield("setWearDelay");
        setWearDelayTextfiled.setValue(Kittymatic.settings.setWearDelay);
        setWearDelayTextfiled.setWidth(100);
        htmlSetWearDelay.append(setWearDelayTextfiled.getMainDiv());

        var htmlJobDelay = $("<div></div>");
        htmlJobDelay.append("<span> Random delay between jobs(seconds)</span>");
        var jobDelayTextFieldMin = new west.gui.Textfield("jobDelay");
        jobDelayTextFieldMin.setValue(Kittymatic.settings.jobDelayMin);
        jobDelayTextFieldMin.setWidth(50);
        var jobDelayTextFieldMax = new west.gui.Textfield("jobDelay");
        jobDelayTextFieldMax.setValue(Kittymatic.settings.jobDelayMax);
        jobDelayTextFieldMax.setWidth(50);

        htmlJobDelay.append(jobDelayTextFieldMin.getMainDiv());
        htmlJobDelay.append("<span> - </span>");
        htmlJobDelay.append(jobDelayTextFieldMax.getMainDiv());

        var htmlRegeneration = $("<div></div>");
        var checkboxEnableRegeneration = new west.gui.Checkbox();
        checkboxEnableRegeneration.setLabel("Enable regeneration");
        checkboxEnableRegeneration.setSelected(Kittymatic.settings.enableRegeneration);
        checkboxEnableRegeneration.setCallback(function () {
            Kittymatic.settings.enableRegeneration = !Kittymatic.settings.enableRegeneration;
            if (Kittymatic.settings.enableRegeneration) {
                $("#regeneration_choices_container").css('visibility', 'visible');
            } else {
                $("#regeneration_choices_container").css('visibility', 'hidden');
            }
        });

        var sleepPlacesCombobox = new west.gui.Combobox("sleep_places");
        Kittymatic.addSleepPlacesItems(sleepPlacesCombobox);
        sleepPlacesCombobox = sleepPlacesCombobox.select(Kittymatic.selectedSleepPlace);
        sleepPlacesCombobox.addListener(function (value) {
            Kittymatic.selectedSleepPlace = value;
            Kittymatic.selectTab("settings");
        });

        var htmlRegenerationChoices = $("<div id='regeneration_choices_container'></div>");
        htmlRegenerationChoices.css({ 'display': 'inline-block', 'padding-left': '10px', 'visibility': (Kittymatic.settings.enableRegeneration) ? 'visible' : "hidden" });
        htmlRegenerationChoices.append($("<span>Sleep place: </span>"));
        htmlRegenerationChoices.append(sleepPlacesCombobox.getMainDiv());

        htmlRegeneration.append(checkboxEnableRegeneration.getMainDiv());
        htmlRegeneration.append(htmlRegenerationChoices);



        var buttonApply = new west.gui.Button("Apply", function () {
            Kittymatic.settings.useConsumablesRuntime = checkboxUseConsumables.isSelected();
            Kittymatic.settings.addEnergy = checkboxAddEnergy.isSelected();
            Kittymatic.settings.addMotivation = checkboxAddMotivation.isSelected();
            Kittymatic.settings.addHealth = checkboxAddHealth.isSelected();
            Kittymatic.settings.goToBank = checkboxGoToBank.isSelected();

            if (Kittymatic.isNumber(acceptableWasteTextfield.getValue())) {
                var acceptableWaste = parseInt(acceptableWasteTextfield.getValue());
                if (acceptableWaste < 0)
                    acceptableWaste = 0;
                else if (acceptableWaste > 100)
                    acceptableWaste = 100;

                console.log("Acceptable waste set to " + acceptableWaste);
                Kittymatic.settings.acceptableWaste = acceptableWaste;

            }

            if (Kittymatic.isNumber(healthStopTextfiled.getValue())) {
                var healthStop = parseInt(healthStopTextfiled.getValue());
                //healthStop = Math.min(30, healthStop);
                Kittymatic.settings.healthStop = healthStop;
            }
            if (Kittymatic.isNumber(moneyStopTextfield.getValue())) {
                var moneyLimit = parseInt(moneyStopTextfield.getValue());
                if (moneyLimit < 0)
                    moneyLimit = 0;

                console.log("Money limit set to " + moneyLimit);
                Kittymatic.settings.moneyLimit = moneyLimit;

            }
            if (Kittymatic.isNumber(setWearDelayTextfiled.getValue())) {
                var setWearDelay = parseInt(setWearDelayTextfiled.getValue());
                setWearDelay = Math.min(10, setWearDelay);
                Kittymatic.settings.setWearDelay = setWearDelay;
            }
            if (Kittymatic.isNumber(jobDelayTextFieldMin.getValue())) {
                var jobDelayTimeMin = parseInt(jobDelayTextFieldMin.getValue());
                Kittymatic.settings.jobDelayMin = jobDelayTimeMin;
            } else {
                Kittymatic.settings.jobDelayMin = 0;
                Kittymatic.settings.jobDelayMax = 0;
                new UserMessage("Wrong format of delay job min value. Please set a number.", UserMessage.TYPE_ERROR).show();
            }
            if (Kittymatic.isNumber(jobDelayTextFieldMax.getValue())) {
                var jobDelayTimeMax = parseInt(jobDelayTextFieldMax.getValue());
                Kittymatic.settings.jobDelayMax = jobDelayTimeMax;
            } else {
                Kittymatic.settings.jobDelayMin = 0;
                Kittymatic.settings.jobDelayMax = 0;
                new UserMessage("Wrong format of delay job max value. Please set a number.", UserMessage.TYPE_ERROR).show();
            }
            Kittymatic.selectTab("settings");
        })

        htmlSkel.append(htmlUseConsumables);
        htmlSkel.append(checkboxAddEnergy.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(checkboxAddMotivation.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(checkboxAddHealth.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(htmlGoToBank);
        htmlSkel.append(htmlHealthStop);
        htmlSkel.append(htmlSetWearDelay);
        htmlSkel.append(htmlJobDelay);
        htmlSkel.append(htmlRegeneration);
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply.getMainDiv());
        return htmlSkel;
    };
    Kittymatic.createStatisticsGui = function () {

        var htmlSkel = $("<div id=\'statistics_overview'\></div>");
        htmlSkel.append($("<span>Job count in this session: <strong>" + Kittymatic.statistics.jobsInSession + "</strong></span><br>"));
        htmlSkel.append($("<span>XP count in this session: <strong>" + Kittymatic.statistics.xpInSession + "</strong></span><br>"));
        htmlSkel.append($("<span>Money count in this session: <strong>" + Kittymatic.statistics.moneyInSession + "</strong></span><br>"));
        htmlSkel.append($("<span>Items found in this session: <strong>" + Kittymatic.statistics.itemsDroppedInSession + "</strong></span><br>"));
        htmlSkel.append($("<span>Most expensive item in this session: <strong>" + Kittymatic.statistics.highestPricedItemInSession + "</strong></span><br>"));
        htmlSkel.append($("<span>Money from items in this session: <strong>" + Kittymatic.statistics.moneyFromItemsInSession + "</strong></span><br>"));
        htmlSkel.append($("<span>Consumables used in this session: <strong>" + Kittymatic.statistics.consumablesUsedInSession + "</strong></span><br>"));
        htmlSkel.append($("<span></span><br>"));

        htmlSkel.append($("<span>Total job count: <strong>" + Kittymatic.statistics.totalJobs + "</strong></span><br>"));
        htmlSkel.append($("<span>Total XP count <strong>" + Kittymatic.statistics.totalXp + "</strong></span><br>"));
        htmlSkel.append($("<span>Total money count: <strong>" + Kittymatic.statistics.totalMoney + "</strong></span><br>"));
        htmlSkel.append($("<span>Total items found: <strong>" + Kittymatic.statistics.totalItemsDropped + "</strong></span><br>"));
        htmlSkel.append($("<span>Most expensive item: <strong>" + Kittymatic.statistics.highestPricedItemTotal + "</strong></span><br>"));
        htmlSkel.append($("<span>Total money from items: <strong>" + Kittymatic.statistics.totalMoneyFromItems + "</strong></span><br>"));
        htmlSkel.append($("<span>Total consumables used: <strong>" + Kittymatic.statistics.totalConsumablesUsed + "</strong></span><br>"));
        htmlSkel.append($("<span></span><br><br><br>"));
        var resetButton = new west.gui.Button("Reset stats", function () {
            Kittymatic.Stats.resetStats();

            Kittymatic.tabLogic(Kittymatic.window, "stats");
        });

        htmlSkel.append(resetButton.getMainDiv());
        return htmlSkel;
    };

    Kittymatic.fixTWIRInventory = function () {
        if ((typeof TWIR !== 'undefined') && Inventory.loaded == undefined) {
            Inventory.guiElements.searchTextfield = new west.gui.Textfield('inventory_search').maxlength(12);
        }
    }

    Kittymatic.createMenuIcon = function () {
        var menuimage = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/500a81fb-2791-4d19-aad0-3d6b643fead6/dgekr3j-259876e6-c14b-4938-80b1-448d03f84d4e.png/v1/fill/w_25,h_25/cat_icon_1320190750608450315_by_ahnorac_dgekr3j-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjUiLCJwYXRoIjoiXC9mXC81MDBhODFmYi0yNzkxLTRkMTktYWFkMC0zZDZiNjQzZmVhZDZcL2RnZWtyM2otMjU5ODc2ZTYtYzE0Yi00OTM4LTgwYjEtNDQ4ZDAzZjg0ZDRlLnBuZyIsIndpZHRoIjoiPD0yNSJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.s1QIL12WMHZFhCUPwhp0QxMQfu24jN-xpYdaJ1AYwrg';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=Kittymatic.loadJobs(); title="Kittymatic" />').css('background-image', 'url(' + menuimage + ')')
            .append((new Date).isWinterTime() ? '<div style="position: absolute;top: -4px;left: 0px;"><img src="/images/items/head/wear/xmas_hat.png" style="height: 33px;transform: rotate(-1deg);"></div>' : "");
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };
    $(document).ready(function () {
        try {
            Kittymatic.fixTWIRInventory();
            Kittymatic.loadLanguage();
            Kittymatic.loadSets(function () { });
            Kittymatic.getStorage();
            Kittymatic.createMenuIcon();
            Kittymatic.requireFiles();
            Kittymatic.Stats.hookHandleChanges();

            var loadThings = async function () {
                await Kittymatic.Helper.loadAllWestSets();
                Kittymatic.Helper.checkLevel();
                return 0;
            }

            Kittymatic.loadJobData(loadThings);

        } catch (e) {
            console.log("exception occured");
        }
    });
})();
