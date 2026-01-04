// ==UserScript==
// @name         Easy Easter (PDA) Right
// @namespace    dev.kwack.torn.easy-easter
// @version      1.2
// @description  Detects any eggs on the page and embeds a navigator to jump to any pages. Quick and dirty in classic Kwack fashion. CSS edited by Phillip_J_Fry 
// @author       Kwack [2190604] & Phillip_J_Fry [2184575] 
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      Apache 2.0 
// @downloadURL https://update.greasyfork.org/scripts/491348/Easy%20Easter%20%28PDA%29%20Right.user.js
// @updateURL https://update.greasyfork.org/scripts/491348/Easy%20Easter%20%28PDA%29%20Right.meta.js
// ==/UserScript==

const eggRootSelector = "div#easter-egg-hunt-root";
const eggButtonSelector = "button";

(async () => {
    const makeEggEasyMode = (egg) => egg.addClass("kw--egg-easy-mode");

    addStyles();
    checkForEggs();
    addNavigator();

    async function checkForEggs() {
        const eggRoot = $(eggRootSelector);
        if (!eggRoot.length) return;
        const eggs = await waitForEggSpawn(eggRoot);
        if (eggs.length) {
            const shouldMakeEasyMode = confirm(
                `${eggs.length} egg${eggs.length > 1 ? "s" : ""} detected on the current page! Do you want to enable Easy Egg mode?`
            );
            if (shouldMakeEasyMode) eggs.each((_, egg) => makeEggEasyMode($(egg)));
        } else console.error("kw--egg: eggs resolved but no eggs found");
    }

    async function waitForEggSpawn(container) {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject("kw--egg: egg spawn timeout"), 5000);
            let eggs = container.find(eggButtonSelector);
            if (eggs[0]) resolve(eggs);
            const observer = new MutationObserver(() => {
                eggs = container.find(eggButtonSelector);
                if (eggs[0]) {
                    observer.disconnect();
                    resolve(eggs);
                }
            });
            observer.observe(container[0], { childList: true, subtree: true });
        });
    }

    function addNavigator() {
        class NavigationController {
            #urls = [];
            constructor(urls) {
                this.#urls = urls;
            }

            get index() {
                const value = GM_getValue("kw--egg-url-index") || 0;
                if (isNaN(value)) return 0;
                return value % this.#urls.length;
            }

            set index(value) {
                if (value < 0) throw new Error("Invalid index setter");
                GM_setValue("kw--egg-url-index", value % this.#urls.length);
            }

            get nextUrl() {
                return this.#urls[this.index];
            }

            handleClick() {
                this.index++;
                window.location.href = "https://www.torn.com/" + this.nextUrl;
            }
        }

        const controller = new NavigationController(getAllLinks());
        addButton(controller.index, controller.handleClick.bind(controller));
    }

    function addButton(index, onclick) {
        $("<button>", { id: "kw--egg-navigator" })
            .append($("<div>").append($("<img>", { src: "https://gyazo.com/0d7e5bd899656fc588b4ccd5ebb3b5b6.png", alt: "Egg Image", height: "35px", width: "45px" })))
            .append($("<span>").text(`(${++index})`)) // Wrap the text in a <span> element
            .on("click", onclick)
            .appendTo(document.body);
    }

    function addStyles() {
        GM_addStyle(`
            .kw--egg-easy-mode {
                position: fixed !important;
                top: 0 !important;
                bottom: 0 !important;
                right: 0 !important;
                left: 0 !important;
                height: 100vh !important;
                width: 100vw !important;
                z-index: 999999998;
            }

            .kw--egg-easy-mode img {
                height: 100px !important;
                width: 175px !important;
            }

            button#kw--egg-navigator {
                position: fixed;
                bottom: 0;
                right: 0;
                margin: 2.5rem;
                background-color: #fff;
                color: #000;
			             padding: 0.5rem;
			             border-radius: 0.2rem;
			             z-index: 999999999;
	             		cursor: pointer;
		}

		body.dark-mode button#kw--egg-navigator {
			background-color: #ADD8E6 ;
			color: #fff;
		}
	`);
	}
})();

function getAllLinks() {
	// This array was pulled from Heasley's Egg Navigator, available at https://greasyfork.org/en/scripts/463484-heasley-s-egg-navigator
	return [
		"index.php",
		"city.php",
		"jobs.php",
		"gym.php",
		"properties.php",
		"properties.php#/p=yourProperties",
		"properties.php#/p=spousesProperties",
		"education.php",
		"crimes.php",
		"loader.php?sid=missions",
		"newspaper.php",
		"jailview.php",
		"hospitalview.php",
		"casino.php",
		"halloffame.php",
		"factions.php",
		"competition.php",
		"friendlist.php",
		"blacklist.php",
		"messages.php",
		"page.php?sid=events",
		"awards.php",
		"points.php",
		"rules.php",
		"staff.php",
		"credits.php",
		"citystats.php",
		"committee.php",
		"bank.php",
		"donator.php",
		"page.php?sid=stocks",
		"fans.php",
		"museum.php",
		"loader.php?sid=racing",
		"church.php",
		"dump.php",
		"loan.php",
		"travelagency.php",
		"amarket.php",
		"bigalgunshop.php",
		"shops.php?step=bitsnbobs",
		"shops.php?step=cyberforce",
		"shops.php?step=docks",
		"shops.php?step=jewelry",
		"shops.php?step=nikeh",
		"shops.php?step=pawnshop",
		"shops.php?step=pharmacy",
		"pmarket.php",
		"shops.php?step=postoffice",
		"shops.php?step=super",
		"shops.php?step=candy",
		"shops.php?step=clothes",
		"shops.php?step=recyclingcenter",
		"shops.php?step=printstore",
		"imarket.php",
		"estateagents.php",
		"bazaar.php?userId=1",
		"calendar.php",
		"token_shop.php",
		"freebies.php",
		"comics.php",
		"joblist.php",
		"newspaper_class.php",
		"personals.php",
		"chronicles.php",
		"bounties.php",
		"trade.php",
		"usersonline.php",
		"profiles.php?XID=1",
		"page.php?sid=log",
		"page.php?sid=ammo",
		"loader.php?sid=itemsMods",
		"displaycase.php#display/",
		"crimes.php?step=criminalrecords",
		"archives.php#/",
		"archives.php#/TheBirthOfTorn",
		"archives.php#/Factions",
		"archives.php#/Employment",
		"archives.php#/TheMarkets",
		"archives.php#/RealEstate",
		"page.php?sid=factionWarfare",
		"page.php?sid=factionWarfare#/ranked",
		"page.php?sid=factionWarfare#/raids",
		"page.php?sid=factionWarfare#/chains",
		"page.php?sid=factionWarfare#/dirty-bombs",
		"bringafriend.php",
		"index.php?page=fortune",
		"page.php?sid=bunker",
		"church.php?step=proposals",
		"dump.php#/trash",
		"messageinc.php",
		"preferences.php",
		"messageinc2.php#!p=main",
		"userimages.php?XID=1",
		"personalstats.php?ID=1",
		"properties.php?step=rentalmarket",
		"properties.php?step=sellingmarket",
		"forums.php",
		"forums.php#/p=forums&f=1",
		"forums.php#/p=forums&f=67",
		"forums.php#/p=forums&f=2",
		"page.php?sid=slots",
		"page.php?sid=roulette",
		"page.php?sid=highlow",
		"page.php?sid=keno",
		"page.php?sid=craps",
		"page.php?sid=bookie",
		"page.php?sid=lottery",
		"page.php?sid=blackjack",
		"page.php?sid=holdem",
		"page.php?sid=russianRoulette",
		"page.php?sid=spinTheWheel",
		"page.php?sid=spinTheWheelLastSpins",
		"page.php?sid=slotsStats",
		"page.php?sid=slotsLastRolls",
		"page.php?sid=rouletteStatistics",
		"page.php?sid=rouletteLastSpins",
		"page.php?sid=highlowStats",
		"page.php?sid=highlowLastGames",
		"page.php?sid=kenoStatistics",
		"page.php?sid=kenoLastGames",
		"page.php?sid=crapsStats",
		"page.php?sid=crapsLastRolls",
		"page.php?sid=bookie#/stats/",
		"page.php?sid=lotteryTicketsBought",
		"page.php?sid=lotteryPreviousWinners",
		"page.php?sid=blackjackStatistics",
		"page.php?sid=blackjackLastGames",
		"page.php?sid=holdemStats",
		"loader.php?sid=viewRussianRouletteLastGames",
		"loader.php?sid=viewRussianRouletteStats",
		"newspaper.php#/archive",
		"messageinc2.php#!p=viewall",
		"bazaar.php#/add",
		"blacklist.php#p=add",
		"bazaar.php#/personalize",
		"factions.php?step=your#/tab=crimes",
		"staff.php#/p=helpapp",
		"factions.php?step=your#/tab=rank",
		"friendlist.php#p=add",
		"page.php?sid=events#onlySaved=true",
		"factions.php?step=your#/tab=controls",
		"factions.php?step=your#/tab=info",
		"messages.php#/p=ignorelist",
		"messages.php#/p=outbox",
		"factions.php?step=your#/tab=upgrades",
		"messages.php#/p=saved",
		"messages.php#/p=compose",
		"displaycase.php#add",
		"displaycase.php#manage",
		"factions.php?step=your#/tab=armoury",
		"bazaar.php#/manage",
		"itemuseparcel.php",
		"index.php?page=rehab",
		"index.php?page=people",
		"christmas_town.php",
		"christmas_town.php#/mymaps",
		"christmas_town.php#/parametereditor",
		"christmas_town.php#/npceditor",
		"page.php?sid=UserList",
		"index.php?page=hunting",
		"old_forums.php",
		"donatordone.php",
		"revive.php",
		"pc.php",
		"loader.php?sid=attackLog",
		"loader.php?sid=attack&user2ID=1",
		"loader.php?sid=crimes",
		"loader.php?sid=crimes#/searchforcash",
		"loader.php?sid=crimes#/bootlegging",
		"loader.php?sid=crimes#/graffiti",
		"loader.php?sid=crimes#/shoplifting",
		"loader.php?sid=crimes#/pickpocketing",
		"loader.php?sid=crimes#/cardskimming",
		"loader.php?sid=crimes#/burglary",
		"loader.php?sid=crimes#/hustling",
		"loader.php?sid=crimes#/disposal",
		"loader.php?sid=crimes#/cracking",
		"loader.php?sid=crimes#/forgery",
		"/war.php?step=rankreport&rankID=69",
		"/war.php?step=warreport&warID=420",
		"/war.php?step=raidreport&raidID=69",
		"/war.php?step=chainreport&chainID=69420",
		"page.php?sid=crimes2",
"https://www.torn.com/forums.php#/p=threads&f=67&t=16366320&b=0&a=0", 
	];
}