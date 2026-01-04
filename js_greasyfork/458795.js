// ==UserScript==
// @name         Automate Theresmore
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Refactor started, still in progress. Initializing automation is required before anything else will work. It will screw up if you do things during the initialization. Currently doesn't do any research automation.
// @author       Nick Damiano
// @match        https://www.theresmoregame.com/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theresmoregame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458795/Automate%20Theresmore.user.js
// @updateURL https://update.greasyfork.org/scripts/458795/Automate%20Theresmore.meta.js
// ==/UserScript==

// Automated buying variables
let autoBuying = false;
let autoBuyInterval = false;
// Automated resource clicking
let autoClickInterval = false;
// Automated scouting variables
let autoExploring = false;
let autoExploringInterval = false;
let currentArmyTarget = false;
// Automated attacking variables
let autoAttacking = false;

// Have we initialized the automation?
let initialized = false;

const debug = false;

let game;
// armies is an object with keys of the battle name and values of an array of size 3 that represents [warriors, heavy warriors, knights]
// this represents warriors with 10/8, heavy warriors with 14/12, and knights with 26/22. There are undoubtedly optimizations to make here
// Found enemies is the list of enemies the player has found by scouting.
const armies = new Map();
let foundEnemies = [];

// Static values (Could probably move these to a json file, but it'd need to be hosted somewhere)
const resourceList = ["Research", "Gold", "Food", "Wood", "Stone", "Copper", "Iron", "Tools", "Cow", "Horse", "Faith", "Mana", "Materials", "Steel", "Crystal", "Supplies", "Saltpetre", "Natronite"];
const buildingList = ["Academy of Freethinkers","A. of Freethinkers Part","Alchemical laboratory","Altar of sacrifices","Artisan Workshop","Ancient vault","Ballista","Barracks","Bank","Builder district","Books","Canava trading post","Carpenter workshop","Castrum Militia","Cathedral","Cathedral part","City center","City center part","City of Lights","City of Lights part","City Hall","Conclave","Common House","Credit union","Farm","Fiefdom","Fortune grove","Fountain of Prosperity","Foundry","Gan Eden","Granary","Guarded warehouse","Great bombard","Great bombard part","Great fair","Great fair unit","Grocery","Large warehouse","Guild of craftsmen","Hall of the dead","Hall of wisdom","Hall of heroic deeds","Hall of heroic deeds part","Harbor district","Harbor district part","Industrial plant","Large storehouse","Library of SouLs","Library of Theresmore","Lumberjack Camp","Machines of gods","Mana pit","Mana pit part","Mansion","Magical tower","Magic Circle","Marketplace","Mausoleum of gods","Matter transmuter","Military academy","Mine","Minefield","Monastery","Monument","Natronite balloon","Natronite depot","Natronite refinery","Natronite shield","Observatory","Officer training ground","Palisade","Palisade part","Pillars of mana","Quarry","Rampart","Rampart part","Portal of the dead","Decryption of the portal","Recruit training center","Refugees district","Refugees district part","Research plant","Residential block","Sawmill","School","Souls","Spiritual garden","Stable","Steelworks","Stock exchange","Stock exchange part","Storage facility","Store","Tax revenue checkpoints","Temple","University","Valley of plenty","Wall","Wall part","Warehouse","Watchman Outpost","The Vaults","Tower of mana","Tower of mana part","Undead Herds","Breeding of nearly living animals",];
const researchList = ["Agriculture","Agreement with Wanders","Alchemical reactions","Archery","Architecture","Astronomy","Ancient stockpile","Bandit chief","Banking","Barbarian tribes","Biology","Breeding","Bronze working","Canava Guard","Chemistry","Cloistered life","Guild of the Craftsmen","Crop Rotation","Crossbow","Construction of automata","Commercial monopolies","Communion with nature","Cuirassiers","Currency","A daylong celebration","Origin of deserter","Dragon assault","Drilling operation","Ecology","Economics","Enclosures","Education","End Ancient Era","End Feudal Era","Espionage","Establish boundaries","Exhibit the Flame","Erase competitors","Fairs and markets","The Fallen Angel reveal","Fertilizer","Feudalism","Field artillery","Financial markets","Fine woods","Fine marbles","The Flame of Atamar","Flight","Flintlock musket","Food conservation","Forge of equipments","Forge of equipments II","Fortification","Fortune sanctuary","Gold domination project","Glorious parade","Glorious retirement","Grain surplus","Great pastures","Guild","Gunpowder","Joyful nation","Joyful nation","Heirloom of the Contract","Heirloom of the Horseshoes","Heirloom of the Housing","Heirloom of the Momento","Canava herald","Housing","Knighthood","Kobold nation","Harbor project","Holy Fury","Infuse the Flame","Iron working","Land mine","Large defensive project","Large storage space","Large pastures","Library of SouLs","Mana rites","Local products","A lonely druid","Long term expedition","Loved by the people","Plate armor","Preparation for the war","Printing press","Professional soldier","Poisoned arrows","Magic","Magic arts teaching","Mana conveyors","Mana engine","Mana utilization","Manufacture","Master craftsmen","Mathematics","Mechanization","Metal casting","Mercenary bands","Military tactics","A moonlight night","Military science","Mining","Mining efficiency","Miracle in the city","Monster epuration","Monster hunting","Monument","Municipal Administration","Mysterious robbery","Mythology","Natrocity","Natronite storage","Necromancy","Sentinels on the walls","Northern Star","Order of clerics","Demoniac pentagram","Portal of the dead","Pottery","The rage of the Druid","Regional Markets","Religion","Religious order","Remember the Ancients","Research district","Safe roads","Scientific Theory","Scout Mission to the East","Servitude","Shores of Theresmore","Siege defense weapons","Siege techniques","Steeling","Stone extraction tools","Stone masonry","Storage","Storage district","Storing valuable materials","Persuade the nobility","Persuade the people","Plenty valley","Tamed Barbarian","The scourge","The vault","Richest nation","Underground mission","Trail of blood","Trail of power","Training militia","Warfare","White Company","Wood cutting","Woodcarvers","Wood saw","Writing",];

// Probably should update to actual values. This works for prioritization though, as the exact amount isn't super important.
const jobList = [{"name": "Farmer", "products": {"Food": 1}},
                 {"name": "Lumberjack", "products": {"Wood": 1}},
                 {"name": "Quarryman", "products": {"Stone": 1}},
                 {"name": "Miner", "products": {"Copper": 1, "Iron": 1}},
                 {"name": "Artisan", "products": {"Gold": 1, "Tools": 1}},
                 {"name": "Merchant", "products": {"Gold": 1}},
                 {"name": "Trader", "products": {"Gold": 1}},
                 {"name": "Breeder", "products": {"Cow": 1, "Horse": 1}},
                 {"name": "Carpenter", "products": {"Materials": 1, "Wood": -1, "Stone": -1, "Tools": -1}},
                 {"name": "Steelworker", "products": {"Steel": 1, "Copper": -1, "Iron": -1}},
                 {"name": "Professor", "products": {"Research": 1, "Crystal": 1}},
                 {"name": "Researcher", "products": {"Research": 1}},
                 {"name": "Supplier", "products": {"Supplies": 1, "Food": -1, "Cow": -1}},
                 {"name": "Skymancer", "products": {"Faith": 1, "Mana": 1}},
                 {"name": "Alchemist", "products": {"Saltpetre": 1}},
                 {"name": "Nat-Refiner", "products": {"Natronite": 1, "Mana": -1, "Saltpetre": -1}},
                ];

function autoClick() {
    // TODO: Figure out a better way to get the 3 buttons
    const elements = document.getElementsByClassName("btn");
    let number = 0;
    return () => {
        // TODO::Fix this. Currently it just runs forever
        // elements is all buttons, so it just kinda keeps going unless you somehow have 0 buttons on screen
        // have it check on finished research rather than length of elements
        if (elements.length == 0) {
            clearInterval(autoClickInterval);
        }
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent == "Food" && number % 3 == 0) {
                elements[i].click();
            }
            if (elements[i].textContent == "Wood" && number % 3 == 1) {
                elements[i].click();
            }
            if (elements[i].textContent == "Stone" && number % 3 == 2) {
                elements[i].click();
            }
        }
        number++;
    }
}

// TODO:: Add auto research to this
function autoBuy() {
    return async () => {
        if (!autoBuying || !initialized) {
            return;
        }
        let bought = false;
        for (const building of game.buildings) {
            if (building.canAfford()) {
                building.buy();
                bought = true;
            }
        }
        if (bought) {
            await sleep(1100);
            await game.updateBuildingCosts();
        }
    }
}

// CLASSES

class Named {
    constructor(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
}

class Incrementable extends Named {
    constructor(name) {
        super(name);
        const card = getCard(this.name);
        // TODO:: move these into a helper functions
        this._count = parseInt(card.querySelector("input").value.split("/")[0].trim());
        this._maxCount = parseInt(card.querySelector("input").value.split("/")[1].trim());
        this._incrementButton = card.querySelectorAll("button")[2];
        this._decrementButton = card.querySelectorAll("button")[1];
    }
    get maxCount() {
        return this._maxCount;
    }
    get count() {
        return this._count;
    }
    async setAmountTo(number) {
        if (number > this.maxCount) {
            log("Attempting to set an incrementable count too high");
            return;
        }
        while (this.count < number) {
            await this.increment();
        }
        while (this.count > number) {
            await this.decrement();
        }
    }
    async increment() {
        this._incrementButton.click();
        this._count++;
        await sleep(50);
    }
    async decrement() {
        this._decrementButton.click();
        this._count--;
        await sleep(50);
    }
}

// TODO::Refactor this away. Should probably be an Army class or something. idk, figure it out tomorrow
class Card {
    constructor(name) {
        this._name = name;
        try {
            this._card = getCard(name);
            this._actionButton = getActionButton(this._card);
            this._chooseTargetButton = getTargetButton(this._card);
        } catch (exception) {
            this.increment = () => {};
            this.decrement = () => {};
            this.act = () => {};
            this.chooseTarget = () => {};
            this.setUnitTo = (number) => {};
        }
    }
    get count() {
        return parseInt(this._card.querySelector("input").value.split("/")[0].trim());
    }
    get maxCount() {
        return parseInt(this._card.querySelector("input").value.split("/")[1].trim());
    }
    async setUnitTo(number) {
        if (number > this.maxCount) {
            log("Attempting to set a unit count too high");
            return;
        }
        while (this.count < number) {
            await this.increment();
        }
        while (this.count > number) {
            await this.decrement();
        }
    }
    // Only on population / army cards
    async increment() {
        this._card.querySelectorAll("button")[2].click();
        await sleep(200);
    }
    async decrement() {
        this._card.querySelectorAll("button")[1].click();
        await sleep(200);
    }
    // Only on explore / attack cards
    async act() {
        this._actionButton.click();
        await sleep(500);
    }
    // Only on attack card
    async chooseTarget(target) {
        this._chooseTargetButton.click();
        await sleep(500);
        const targets = getEnemiesList();
        for (let i = 0; i < targets.length; i++) {
            if (targets[i].innerHTML.includes(target)) {
                targets[i].click();
                await sleep(500);
                return;
            }
        }
    }
}

class Resource extends Named {
    get count() {
        return this._getResourceRow().count;
    }
    get max() {
        return this._getResourceRow().max;
    }
    get perSecond() {
        return this._getResourceRow().perSecond;
    }
    toString() {
        return "{" + this._name + " count: " + this.count + ", max " + this.max + ", " + this.perSecond + " per second}";
    }
    _getResourceRow() {
        const resourceList = getResourceList();
        return resourceList[this._name];
    }
}

class Job extends Incrementable {
    constructor(name, products) {
        super(name);
        this._products = products;
    }
    // Later will need to update this with the actual amount
    // Possibly. It seems to work without it, so meh?
    get products() {
        return this._products;
    }
}

class Buyable extends Named {
    _cost = null;
    get cost() {
        return this._cost;
    }
    get count() {
        return getBuyableCount(this.name);
    }
    get timeToBuyable() {
        let time = 0;
        for (const [resourceType, amount] of Object.entries(this.cost)) {
            const resource = game._resources[resourceType];
            if (resource.count < amount) {
                time = (amount - resource.count) / resource.perSecond;
            }
        }
        return time;
    }
    get isCapped() {
        try {
            return getPurchaseButton(this.name).classList.contains('btn-cap');
        } catch (e) {
            return false;
        }
    }
    canAfford() {
        try {
            for (const [resourceType, amount] of Object.entries(this.cost)) {
                const resource = game._resources[resourceType];
                if (resource.count < amount) {
                    return false;
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }
    async updateCost() {
        try {
            this._cost = await getCost(this.name);
        } catch (e) {
            console.log("Failed to get cost for " + this.name);
        }
    }
    async buy() {
        if (this.canAfford()) {
            const purchaseButton = await getPurchaseButton(this.name);
            purchaseButton.click();
            await sleep(1100);
            return true;
        }
        return false;
    }
}

class Game {
    _updatingPrices = false;
    _resources = {
        [Symbol.iterator]() {
            return Object.values(this)[Symbol.iterator]();
        }
    };
    _buildings = {
        [Symbol.iterator]() {
            return Object.values(this)[Symbol.iterator]();
        }
    };
    // TODO::Research logic to be added
    _researches = {
        [Symbol.iterator]() {
            return Object.values(this)[Symbol.iterator]();
        }
    };
    constructor() {
        for (const resource of resourceList) {
            this._resources[resource] = new Resource(resource);
        }
        for (const building of buildingList) {
            this._buildings[building] = new Buyable(building);
        }
    }
    get jobs() {
        const jobs = {};
        for (const job of jobList) {
            jobs[job.name] = new Job(job.name, job.products);
        }
        return jobs;
    }
    get totalWorkers() {
        return formatNumber(getWorkers()[1]);
    }
    get availableWorkers() {
        return formatNumber(getWorkers()[0]);
    }
    get buildings() {
        return this._buildings;
    }
    getJobsForResources = (resources) => {
        const toReturn = [];
        for (const [name, job] of Object.entries(this.jobs)) {
            for (const [resource, value] of Object.entries(job.products)) {
                if (resource in resources && value > 0) {
                    toReturn.push(job);
                }
            }
        }
        return toReturn;
    }
    get nonMaxedJobs() {
        const toReturn = [];
        for (const [name, job] of Object.entries(this.jobs)) {
            if (job.count < job.maxCount) {
                toReturn.push(job);
            }
        }
        return toReturn;
    }
    updateBuildingCosts = async () => {
        if (!this._updatingPrices) {
            this._updatingPrices = true;
            await switchTab("Build");
            for (const [key, building] of Object.entries(this.buildings)) {
                if (building.isCapped) {
                    delete this.buildings[key];
                } else {
                    await building.updateCost();
                }
            }
            this._updatingPrices = false;
        }
    }
    prioritizeBuilding = async (building) => {
        const targetBuilding = this.buildings[building];
        await targetBuilding.updateCost();
        await switchTab("Population");
        await getClearAllWorkersButton().click();

        // if we can just max all the jobs for resources, do that.
        const jobsForResources = this.getJobsForResources(targetBuilding.cost);
        let totalWorkersNeeded = 0;
        for (const job of jobsForResources) {
            totalWorkersNeeded += job.maxCount;
        }
        if (totalWorkersNeeded < this.availableWorkers) {
            for (const job of jobsForResources) {
                await job.setAmountTo(job.maxCount);
            }
        } else {
            // If we can't, figure out the "least time" to build, then do that.
            let incremented = true;
            while (this.availableWorkers > 0 && incremented) {
                incremented = false;
                let timeToBuild = targetBuilding.timeToBuyable;
                for (const job of jobsForResources) {
                    await job.increment();
                    if (targetBuilding.timeToBuyable < timeToBuild) {
                        incremented = true;
                        timeToBuild = targetBuilding.timeToBuyable;
                    } else {
                        await job.decrement();
                    }
                }
            }
        }
        // Make all resources non negative
        for (const [resource, values] of Object.entries(this._resources)) {
            if (values.perSecond < 0) {
                for (const [name, job] of Object.entries(this.jobs)) {
                    if (resource in job.products) {
                        if (job.products[resource] > 0) {
                            while (values.perSecond < 0 && job.maxCount != job.count) {
                                await job.increment();
                            }
                        }
                    }
                }
            }
        }
        // Evenly distribute other available workers to the unemployed
        while (this.availableWorkers > 1) {
            for (const job of this.nonMaxedJobs) {
                await job.increment();
            }
        }
    }
}

// AUTOMATIONS

const autoExplore = () => {
    // Change here to change how many scouts used
    const count = 10;
    return () => {
        if (autoExploring) {
            scout(10);
        }
    }
}

const autoAttack = async () => {
    if (armies.size == 0) {
        // If we've already cleared all enemies, stop auto fighting
        return;
    }
    if (autoAttacking === false) {
        // If the player has set no auto attack, no auto attack
        setTimeout(autoAttack, 60000);
        return;
    }

    if (currentArmyTarget === false) {
        // if we don't have a target get the first enemy we've scouted
        foundEnemies = await getFoundEnemies();
        for (const enemy of armies.keys()) {
            if (foundEnemies.includes(enemy)) {
                currentArmyTarget = enemy;
                break;
            }
        }

        // if we don't have any enemies left to fight, scout for more
        if (currentArmyTarget === false) {
            console.log("No Enemy found, scouting. Unfound enemies: " + Array.from(armies.keys()));
            scout(10);
            setTimeout(autoAttack, 65000);
            return;
        }
    }

    // Build our army
    let unitCounts = armies.get(currentArmyTarget);
    unitCounts = updateUnitCounts(unitCounts);
    log("Auto attacking " + currentArmyTarget);
    await buyUnits(unitCounts);
    // Because buy units doesn't guarantee enough units, we must check if we can win
    if (canBeat(unitCounts)) {
        await setUnits(unitCounts);
        await fight(currentArmyTarget);
        armies.delete(currentArmyTarget);
        currentArmyTarget = false;
    }
    if (Math.random() < 0.5) {
        await switchTab("Build");
    } else {
        await switchTab("Research");
    }
    setTimeout(autoAttack, 65000);
}

// ======================================= GAME FUNCTIONS ========================================

const research = async (target) => {
    try {
        await switchTab("Research");
        await buy(target);
        await switchTab("Build");
    } catch (e) {
        console.log("Could not research " + target + ". Got exception: " + e);
        await switchTab("Build");
    }
}

const buy = async (target) => {
    const button = getPurchaseButton(target);
    button.click();
    await sleep(1100);
}

const canBuy = (target) => {
    try {
        const button = getPurchaseButton(target);
        return !button.classList.contains("btn-off");
    } catch (e) {
        return false;
    }
}

const getCost = async (target) => {
    const button = getPurchaseButton(target);
    button.dispatchEvent(new Event("mouseenter"));
    // TODO::Refactor this to use MutationObersver: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    // As it is this is incredibly fragile. The mouse moving can break it, and I think the mutation observer API can be used to cheat that by immediately listening for the new element
    // The api can also return the content, meaning we may be able to get rid of both sleeps, and make this insanely faster.
    // Another alternative is to validate that the table card has the proper header (IE h5.textContent = target).
    await sleep(70);
    const costRows = document.querySelectorAll("table")[1].querySelectorAll("tr");
    const cost = {};
    for (let i = 0; i < costRows.length; i++) {
        let key = costRows[i].querySelectorAll("td")[0].textContent;
        let value = formatNumber(costRows[i].querySelectorAll("td")[1].textContent.split(" ")[0]);
        cost[key] = value;
    }
    button.dispatchEvent(new Event("mouseleave"));
    await sleep(70);
    return cost;
}

const buyableToAmount = async (target, amount) => {
    log("Buying up to " + amount + " " + target + ".");
    let count = getBuyableCount(target);
    const button = getPurchaseButton(target);
    while (count < amount && canBuy(target)) {
        log("Buying a " + target);
        button.click();
        await sleep(1100);
        count = getBuyableCount(target);
    }
}

const getBuyableCount = (target) => {
    try {
        return getPurchaseButton(target).querySelectorAll("span")[1].textContent || 0;
    } catch (e) {
        return 0;
    }
}

const buyUnits = async (unitCounts) => {
    await switchTab("Army");
    await switchSubTab("Army");
    await buyableToAmount("Warrior", unitCounts[0]);
    await buyableToAmount("Heavy warrior", unitCounts[1]);
    await buyableToAmount("Knight", unitCounts[2]);
}

const enableSpell = async (prayer) => {
    try {
        await switchTab("Magic");
        await switchSubTab("Spells");
        const card = await getCard(prayer);
        const button = card.querySelector(".btn");
        if (button.textContent == "Cast this spell") {
            button.click();
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

const disableSpell = async (prayer) => {
    try {
        await switchTab("Magic");
        await switchSubTab("Spells");
        const card = await getCard(prayer);
        const button = card.querySelector(".btn");
        if (button.textContent == "Cancel this spell") {
            button.click();
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

// ======================== COMBAT GAME FUNCTIONS ===============================

const scout = async (count) => {
    try {
        await switchTab("Army");
        await switchSubTab("Army");
        await buyableToAmount("Scout", count);
        await switchSubTab("Explore");
        const scoutCard = new Card("Scout");
        await scoutCard.setUnitTo(count);
        const exploreCard = new Card("Explore");
        await exploreCard.act();
        await switchTab("Build");
    } catch (e) {
        await switchTab("Build");
    }
}

const canBeat = (unitCounts) => {
    log("Checking if we can beat");
    const realUnitCounts = updateUnitCounts(unitCounts);
    const enoughWarriors = getBuyableCount("Warrior") >= realUnitCounts[0];
    const enoughHeavyWarriors = getBuyableCount("Heavy warrior") >= realUnitCounts[1];
    const enoughKnights = getBuyableCount("Knight") >= realUnitCounts[2];
    return enoughWarriors && enoughHeavyWarriors && enoughKnights;
}

const setUnits = async (unitCounts) => {
    await switchTab("Army");
    await switchSubTab("Attack");
    const cards = [new Card("Warrior"), new Card("Heavy warrior"), new Card("Knight")];
    for (let i = 0; i < 3; i++) {
        try {
            await cards[i].setUnitTo(unitCounts[i]);
        } catch (e) {
            console.log("Unable to set unit " + i);
        }
    }
}

const fight = async (target) => {
    await switchTab("Army");
    await switchSubTab("Attack");
    let attackCard = new Card("Attack");
    await attackCard.chooseTarget(target);
    await attackCard.act();
}

const getUnitStats = async (unit) => {
    // TODO:: Get unit stats by switching to the page and looking at popover
    return [-1,-1];
}

const updateUnitCounts = async (unitCounts) => {
    // TODO:: account for spells / buildings
    // Probably just hover the unit and calculate it's attack / defense
    // unitCount[i] = unitCount[i] * Math.max(newAttack / oldAttack, newDefense / oldDefense)
    return unitCounts;
}

// HELPER FUNCTIONS

const initializeAutomation = async () => {
    initialized = false;
    await game.updateBuildingCosts();
    await initializeArmies();
    await sleep(500);
    await autoAttack();
    initialized = true;
}

const initializeArmies = async () => {
    armies.set("King Kobold Nation", [56,52,0]);
    armies.set("Barbarian Horde", [150,140,0]);
    armies.set("Cave of bats", [1,0,0]);
    armies.set("Rat cellar", [1,0,0]);
    armies.set("Kobold looters", [2,0,0]);
    armies.set("Nasty pillagers", [2,0,0]);
    armies.set("Prisoner wagon", [2,0,0]);
    armies.set("Old herd", [3,0,0]);
    armies.set("Old storage room", [3,0,0]);
    armies.set("Bandit Camp", [5,0,0]);
    armies.set("Ancient burial place", [9,0,0]);
    armies.set("Ancient hideout", [9,0,0]);
    armies.set("Goblin lair", [6,5,0]);
    armies.set("Haunted library", [8,0,0]);
    armies.set("Korrigan dolmen", [5,4,0]);
    armies.set("Wolf pack", [6,0,0]);
    armies.set("Barbarian camp", [15,14,0]);
    armies.set("Bugbear tribe", [10,8,0]);
    armies.set("Burning Pit", [12,11,0]);
    armies.set("Gnoll Raiding Party", [11,10,0]);
    armies.set("Harpy Nest", [11,10,0]);
    armies.set("Hobgoblin encampment", [10,7,0]);
    armies.set("Kobold tunnels", [8,7,0]);
    armies.set("Naga Nest", [11,10,0]);
    armies.set("Rusted warehouse", [8,3,0]);
    armies.set("Snakes nest", [7,6,0]);
    armies.set("Temple of gargoyles", [13,9,0]);
    armies.set("Troll Cave", [11,9,0]);
    armies.set("Barren Hills", [20,19,0]);
    armies.set("Mountain Cave", [30,26,0]);
    armies.set("Basilisk Cave", [0,0,15]);
    armies.set("Black Mage Tower", [0,0,13]);
    armies.set("Construction site", [20,20,0]);
    armies.set("Deserter Den", [12,11,0]);
    armies.set("Golem cave", [20,16,0]);
    armies.set("Kobold City", [20,19,0]);
    armies.set("Mercenary Camp", [24,23,0]);
    armies.set("Myconid Cavern", [14,10,0]);
    armies.set("Necromancer Crypt", [17,16,0]);
    armies.set("Skullface encampment", [19,18,0]);
    armies.set("Spider forest", [12,11,0]);
    armies.set("A strange village", [13,12,0]);
    armies.set("Wyvern Nest", [27,25,0]);
    armies.set("Demonic portal", [43,41,0]);
    armies.set("Djinn Palace", [49,48,0]);
    armies.set("Hydra pit", [49,48,0]);
    armies.set("Lich temple", [42,42,0]);
    // armies.set("Forest of Markanat", [46,45,0]);
    armies.set("Barbarian Village", [45,43,0]);
    // armies.set("Gloomy werewolf forest", [45,43,0]); // Need to use tanks probably
    armies.set("Gorgon cave", [48,48,0]);
    await clearFinishedFights();
}

const clearFinishedFights = async () => {
    const finishedFights = await getFinishedFights();
    for (let i = 0; i < finishedFights.length; i++) {
        armies.delete(finishedFights[i]);
    }
}

const switchTab = async (target) => {
    const tabs = document.querySelectorAll('div[role="tablist"] > button');
    tabs.forEach(async (tab) => {
        if (tab.getAttribute("aria-selected") == "false" && tab.innerText.includes(target)) {
            log("Switching tab to " + target);
            tab.click();
        }
    });
    await sleep(400);
}

const switchSubTab = async (target) => {
    const tabs = document.querySelectorAll('div[role="tablist"]')[1].querySelectorAll('button');
    tabs.forEach(async (tab) => {
        if (tab.getAttribute("aria-selected") == "false" && tab.innerText.includes(target)) {
            log("Switching sub tab to " + target);
            tab.click();
        }
    });
    await sleep(400);
}

const getPurchaseButton = (target) => {
    log("Getting purchase button for " + target);
    return Array.from(document.querySelectorAll("button.btn")).find(el => el.textContent.includes(target)) || {};
}

const getCard = (target) => {
    log("Getting " + target + " card");
    const cards = document.querySelectorAll(".p-4.rounded-lg");
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].querySelector('h5').innerText.includes(target)) {
            return cards[i];
        }
    }
}

const getEnemiesList = () => {
    log("Getting enemy list");
    return document.querySelectorAll("div.modal-container > div > div > div > table > tbody > tr");
}

const getActionButton = (card) => {
    log("Getting action button");
    return Array.from(card.querySelectorAll("button")).filter(e => e.textContent.includes("Send"))[0];
}

const getTargetButton = (card) => {
    log("Getting target button");
    return Array.from(card.querySelectorAll("button")).at(-2);
}

const getFinishedFights = async () => {
    await switchTab("Army");
    await switchSubTab("Enemies");
    const buttons = document.querySelectorAll(".btn-cap");
    return Array.from(buttons).map(e => e.textContent);
}

const getFoundEnemies = async () => {
    await switchTab("Army");
    await switchTab("Attack");
    const card = getCard("Attack");
    const button = getTargetButton(card);
    button.click();
    await sleep(500);
    const list = getEnemiesList();
    return Array.from(list).map(e => e.querySelectorAll("h5")[0].textContent);
}

const getResourceList = () => {
    const rows = document.querySelectorAll("table")[0].querySelectorAll("tr");
    const toReturn = Array.from(rows).map(e => {
        const q = e.querySelectorAll("td");
        const name = q[0].textContent;
        const current = formatNumber(q[1].textContent.split(" / ")[0]);
        const max = formatNumber(q[1].textContent.split(" / ")[1]);
        const perSecond = Number(q[2].textContent.replace("/s", ""));
        return {"name": name, "count": current, "max": max, "perSecond": perSecond};
    }).reduce(
        (accumulator, currentValue) => {
            accumulator[currentValue.name] = {"count": currentValue.count, "max": currentValue.max, "perSecond": currentValue.perSecond};
            return accumulator;
        },
        new Object()
    );
    return toReturn;
}

const formatNumber = (numberString) => {
    numberString = numberString.replace(",","");
    let num = 0;
    if (numberString.includes("K")) {
        numberString = numberString.replace("K", "");
        num = Number(numberString);
        num *= 1000;
    } else {
        num = Number(numberString);
    }
    return num;
}

const getClearAllWorkersButton = () => {
    return document.querySelectorAll("button")[11];
}

const getWorkers = () => {
    return document.querySelector("div.text-lg span").textContent.split(" / ");
}

const sleep = (miliseconds) => new Promise((resolve) => setTimeout(resolve, miliseconds));

const log = (message) => { if (debug) { console.log(message); } };


(async function() {

    await sleep(1000);

    'use strict';
    let buttonLocation = document.evaluate("/html/body/div/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    buttonLocation.classList.remove("lg:z-10");
    buttonLocation.classList.add("lg:z-100");

    var autoBuyButton = document.createElement("BUTTON");
    autoBuyButton.classList.add("btn");
    autoBuyButton.classList.add("btn-dark");
    autoBuyButton.textContent = "Auto buy";
    autoBuyButton.addEventListener("click", () => { autoBuying = !autoBuying; autoBuyButton.classList.toggle("btn-cap");});
    buttonLocation.prepend(autoBuyButton);

    var autoScoutButton = document.createElement("BUTTON");
    autoScoutButton.classList.add("btn");
    autoScoutButton.classList.add("btn-dark");
    autoScoutButton.textContent = "Auto explore";
    autoScoutButton.addEventListener("click", () => { autoExploring = !autoExploring; autoScoutButton.classList.toggle("btn-cap");});
    buttonLocation.prepend(autoScoutButton);

    var autoAttackButton = document.createElement("BUTTON");
    autoAttackButton.classList.add("btn");
    autoAttackButton.classList.add("btn-dark");
    autoAttackButton.textContent = "Auto attack";
    autoAttackButton.addEventListener("click", () => { autoAttacking = !autoAttacking; autoAttackButton.classList.toggle("btn-cap");});
    buttonLocation.prepend(autoAttackButton);

    var initializeAutomationButton = document.createElement("BUTTON");
    initializeAutomationButton.classList.add("btn");
    initializeAutomationButton.classList.add("btn-dark");
    initializeAutomationButton.textContent = "Initialize Automation";
    initializeAutomationButton.addEventListener("click", initializeAutomation);
    buttonLocation.prepend(initializeAutomationButton);

    autoBuyInterval = setInterval(autoBuy(), 1000);
    autoClickInterval = setInterval(autoClick(), 100);
    autoExploringInterval = setInterval(autoExplore(), 65000);

    game = new Game();

})();