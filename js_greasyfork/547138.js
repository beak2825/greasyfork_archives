// ==UserScript==
// @name			HWHDataExportExt
// @name:en			HWHDataExportExt
// @name:ru			HWHDataExportExt
// @namespace		HWHDataExportExt
// @version			1.0.8.3
// @description		Extension for HeroWarsHelper script
// @description:en	Extension for HeroWarsHelper script
// @description:ru	Расширение для скрипта HeroWarsHelper
// @author			Asta Roth, ZingerY
// @license 		Copyright Asta Roth & ZingerY
// @homepage		https://greasyfork.org/ru/scripts/547138-hwhdataexportext
// @icon			https://zingery.ru/scripts/VaultBoyIco16.ico
// @icon64			https://zingery.ru/scripts/VaultBoyIco64.png
// @match			https://www.hero-wars.com/*
// @match			https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/547138/HWHDataExportExt.user.js
// @updateURL https://update.greasyfork.org/scripts/547138/HWHDataExportExt.meta.js
// ==/UserScript==

/* Only the used functions are declared there, here is the declaration of all available functions, the unused ones can be removed: */
const {
getInput,
setProgress,
hideProgress,
I18N,
send,
getTimer,
countdownTimer,
getUserInfo,
getSaveVal,
setSaveVal,
popup,
random,
} = HWHFuncs;


(function () {
	if (!this.HWHClasses) {
		console.log('%cObject for extension not found', 'color: red');
		return;
	}

	console.log('%cStart Extension ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: red');
	const { addExtentionName } = HWHFuncs;
	addExtentionName(GM_info.script.name, GM_info.script.version, GM_info.script.author);

Object.assign(HWHData.i18nLangData.en, {
    /* Asta's Additions - Shortcut for Ascension and Export Data buttons including new Guild Stats */
    ASCENSION_TITLE: 'Fast travel to Ascension',
    ASCENSION: 'Ascension',
    EXPORT_DATA: 'Export Data',
    EXPORT_DATA_TITLE: 'Export Hero, Titan, Pet, Inventory Data to Clipboard',
    HEROES_EXPORT: 'Heroes',
    HEROES_EXPORT_TITLE: 'Exports Heroes Data to Clipboard',
    HEROES_EXPORT_COPY: 'Heroes Data has been exported successfully.',
    TITANS_EXPORT: 'Titans',
    TITANS_EXPORT_TITLE: 'Exports Titans Data to Clipboard',
    TITANS_EXPORT_COPY: 'Titans Data has been exported successfully.',
    PETS_EXPORT_COPY: 'Pets Data exported to clipboard',
    PETS_EXPORT: 'Pets',
    PETS_EXPORT_TITLE: 'Exports Pets Data to clipboard',
    TOTEMS_EXPORT_COPY: 'Totems Data exported to clipboard',
    TOTEMS_EXPORT: 'Totems',
    TOTEMS_EXPORT_TITLE: 'Exports Totems Data to clipboard',
    WISDOM_EXPORT_COPY: 'Wisdom Tree Data exported to clipboard',
    WISDOM_EXPORT: 'Wisdom Tree',
    WISDOM_EXPORT_TITLE: 'Exports Wisdom Tree Data to clipboard',
    INVENTORY_EXPORT: 'Inventory',
    INVENTORY_EXPORT_TITLE: 'Exports Inventory Data to Clipboard',
    INVENTORY_EXPORT_COPY: 'Inventory Data has been exported successfully.',
    CLAN_STAT_NEW_COPY: 'Guild Statistics exported to clipboard',
    CLAN_STAT_NEW: 'Guild Statistics',
    CLAN_STAT_NEW_TITLE: 'Exports Guild Statistics to the clipboard',
    HERO_SKIN_DATA_COPY: 'Hero Skin Data exported to clipboard',
    HERO_SKIN_DATA: 'Hero Skin Data',
    HERO_SKIN_DATA_TITLE: 'Exports Hero Skin Data to clipboard',
});

Object.assign(HWHData.i18nLangData.ru, {
    /* Asta's Additions - Shortcut for Ascension and Export Data buttons - RU */
    ASCENSION_TITLE: 'Перейти к Вознесению',
    ASCENSION: 'Вознесение',
    EXPORT_DATA: 'Экспорт данных',
    EXPORT_DATA_TITLE: 'Экспорт данных о героях, титанах, питомцах и инвентаре в буфер обмена',
    HEROES_EXPORT: 'Герои',
    HEROES_EXPORT_TITLE: 'Экспорт данных о героях в буфер обмена',
    HEROES_EXPORT_COPY: 'Данные героев успешно экспортированы.',
    TITANS_EXPORT: 'Титаны',
    TITANS_EXPORT_TITLE: 'Экспорт данных о титанах в буфер обмена',
    TITANS_EXPORT_COPY: 'Данные титанов успешно экспортированы.',
    PETS_EXPORT: 'Питомцы',
    PETS_EXPORT_TITLE: 'Экспорт данных о питомцах в буфер обмена',
    PETS_EXPORT_COPY: 'Данные питомцев успешно экспортированы.',
    TOTEMS_EXPORT_COPY: 'Данные тотемов успешно экспортированы.',
    TOTEMS_EXPORT: 'Тотемы',
    TOTEMS_EXPORT_TITLE: 'Экспорт данных о тотемах в буфер обмена',
    WISDOM_EXPORT_COPY: 'Данные Дерева Мудрости успешно экспортированы.',
    WISDOM_EXPORT: 'Дерево Мудрости',
    WISDOM_EXPORT_TITLE: 'Экспорт данных о Дереве Мудрости в буфер обмена',
    INVENTORY_EXPORT: 'Инвентарь',
    INVENTORY_EXPORT_TITLE: 'Экспорт данных об инвентаре в буфер обмена',
    INVENTORY_EXPORT_COPY: 'Данные инвентаря успешно экспортированы.',
    CLAN_STAT_NEW_COPY: 'Клановая статистика скопирована в буфер обмена',
    CLAN_STAT_NEW: 'Клановая статистика',
    CLAN_STAT_NEW_TITLE: 'Копирует клановую статистику в буфер обмена',
    HERO_SKIN_DATA_COPY: 'Hero Skin Data скопирована в буфер обмена',
    HERO_SKIN_DATA: 'Hero Skin Data',
    HERO_SKIN_DATA_TITLE: 'Копирует Hero Skin Data в буфер обмена',
});

	const { buttons } = HWHData;

    buttons['exportData'] = {
		get name() { return I18N('EXPORT_DATA'); },
		get title() { return I18N('EXPORT_DATA_TITLE'); },
		color: 'green',
		onClick: onClickExportData,
	};

	buttons['goToAscension'] = {
		get name() { return I18N('ASCENSION'); },
		get title() { return I18N('ASCENSION_TITLE'); },
		onClick: goAscension,
		dot: true,
	};
 	async function goAscension() {
		cheats.goNavigtor('HERO_ASCENSION');
	};

	const { popup, confShow } = HWHFuncs;
	async function onClickExportData() {
		const popupButtons = [
			{
				msg: I18N('HEROES_EXPORT'),
				result: exportHeroesData,
				get title() { return I18N('HEROES_EXPORT_TITLE'); },
			},
			{
				msg: I18N('TITANS_EXPORT'),
				result: exportTitansData,
				get title() { return I18N('TITANS_EXPORT_TITLE'); },
			},
			{
				msg: I18N('PETS_EXPORT'),
				result: exportPetsData,
				get title() { return I18N('PETS_EXPORT_TITLE'); },
			},
			{
				msg: I18N('TOTEMS_EXPORT'),
				result: exportTotemsData,
				get title() { return I18N('TOTEMS_EXPORT_TITLE'); },
			},
			{
				msg: I18N('WISDOM_EXPORT'),
				result: exportWisdomTreeData,
				get title() { return I18N('WISDOM_EXPORT_TITLE'); },
			},
			{
				msg: I18N('INVENTORY_EXPORT'),
				result: exportInventoryData,
				get title() { return I18N('INVENTORY_EXPORT_TITLE'); },
			},
			{
				msg: I18N('CLAN_STAT_NEW'),
				result: clanStatisticNew,
				get title() { return I18N('CLAN_STAT_NEW_TITLE'); },
			},
			{
				msg: I18N('HERO_SKIN_DATA'),
				result: exportSkinData,
				get title() { return I18N('HERO_SKIN_DATA_TITLE'); },
			},
		];
		popupButtons.push({ result: false, isClose: true });
		const answer = await popup.confirm(`${I18N('CHOOSE_ACTION')}:`, popupButtons);
		if (typeof answer === 'function') {
			answer();
		}
	}

/* adding actual functions */

/* Added by Asta Roth */
const copyToClipboard = function(text, dataType) {
  // Create a temporary textarea element to hold the text
  const tempTextarea = document.createElement("textarea");
  tempTextarea.style.position = "fixed";
  tempTextarea.style.opacity = "0";
  tempTextarea.textContent = text;
  document.body.appendChild(tempTextarea);

  // Select the content of the textarea and execute the copy command
  tempTextarea.select();
  document.execCommand("copy");

  // Clean up by removing the temporary textarea
  document.body.removeChild(tempTextarea);

  console.log(`🎉 ${dataType} data successfully copied to your clipboard as tab-separated values!`);
};

/* New Clan Statistics Export - tab delimited for easier import into spreadsheets  */
/* added Prestige, Totals, Dates for Weekly Columns */

async function clanStatisticNew() {

    const calls = [
        { name: "clanGetInfo", args: {}, ident: "clanGetInfo" },
        { name: "clanGetWeeklyStat", args: {}, ident: "clanGetWeeklyStat" },
        { name: "clanGetLog", args: {}, ident: "clanGetLog" },
    ];

    const result = await Send(JSON.stringify({ calls }));

    const dataClanInfo = result.results[0].result.response;
    const dataClanStat = result.results[1].result.response;

    const getRole = (roleNumber) => {
        switch (Number(roleNumber)) {
            case 255:
            case 1:
                return 'Guild Master';
            case 2:
                return 'Member';
            case 3:
                return 'Officer';
            case 4:
                return 'General';
            default:
                return 'Unknown';
        }
    };

    const allClanMembers = {};

    for (const memberId in dataClanInfo.clan.members) {
        allClanMembers[memberId] = {
            ...dataClanInfo.clan.members[memberId],
            isChampion: dataClanInfo.clan.warriors.includes(Number(memberId)),
        };
    }

    for (const stat of dataClanInfo.membersStat) {
        if (allClanMembers[stat.userId]) {
            allClanMembers[stat.userId] = { ...allClanMembers[stat.userId], ...stat };
        }
    }

    for (const stat of dataClanStat.stat) {
        if (allClanMembers[stat.id]) {
            allClanMembers[stat.id] = { ...allClanMembers[stat.id], ...stat };
        }
    }

    const infoArr = [];

    for (const memberId in allClanMembers) {
        const member = allClanMembers[memberId];

        const totalClanWar = (member.clanWarStat || []).reduce((sum, val) => sum + val, 0);
        const totalAdventures = (member.adventureStat || []).reduce((sum, val) => sum + val, 0);
        const totalGifts = (member.clanGifts || []).reduce((sum, val) => sum + val, 0);

        const memberData = [
            memberId,
            member.name,
            getRole(member.clanRole),
            member.level,
            member.isChampion ? 'Yes' : 'No',
            (new Date(member.lastLoginTime * 1000)).toLocaleString().replace(',', ''),
            // --- Totals Section ---
            member.activitySum,
            member.dungeonActivitySum,
            totalClanWar,
            totalAdventures,
            totalGifts,
            member.prestigeSum,
            // --- Today's Stats Section ---
            member.todayActivity,
            member.todayDungeonActivity,
            member.todayPrestige,
            // --- Weekly Stats (reversed to be most recent first) ---
            ...(member.activity ? member.activity.reverse() : []),
            ...(member.dungeonActivity ? member.dungeonActivity.reverse() : []),
            ...(member.adventureStat ? member.adventureStat.reverse() : []),
            ...(member.clanGifts ? member.clanGifts.reverse() : []),
            ...(member.clanWarStat ? member.clanWarStat.reverse() : []),
        ];
        infoArr.push(memberData);
    }

    const info = infoArr.sort((a, b) => (b[3] - a[3])).map((e) => e.join('\t')).join('\n');

    const getWeeklyDates = () => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(`${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`);
        }
        return dates;
    };

    const dates = getWeeklyDates();
    const headers = [
        "ID", "Name", "Guild Role", "Level", "Champion", "Last Seen",
        // --- Totals Headers ---
        "Total Activity", "Total Titanite", "Total GW", "Total Adv.", "Total GM Gifts", "Total Prestige",
        // --- Today's Headers ---
        "Current Activity", "Current Titanite", "Current Prestige",
        // --- Weekly Headers ---
        ...dates.map(date => `Act. ${date}`),
        ...dates.map(date => `Tit. ${date}`),
        ...dates.map(date => `Adv. ${date}`),
        ...dates.map(date => `Gifts ${date}`),
        ...dates.map(date => `GW ${date}`),
    ].join('\t');

    const finalInfo = `${headers}\n${info}`;

    console.log(finalInfo);
    copyToClipboard(finalInfo, "Guild Stats");
    setProgress(I18N('CLAN_STAT_NEW_COPY'), true);
}

/* Optimized Function to copy Hero Data to clipboard */
/* So one other improvement can be parsing the schema lib for skin data instead of adding it Sheets from HeroSkinRefSheet
we might not event need skin ref if all the data is here. Though that's a lot more data calls per export.
*/

async function exportHeroesData() {
    console.log("Starting hero data retrieval and conversion...");

    try {
        // Cache frequently used data
        const heroPerk = {
            "1": { "ident": "female", "id": 1, "type": "gender" },
            "2": { "ident": "male", "id": 2, "type": "gender" },
            "3": { "ident": "archer", "id": 3, "type": "gender" },
            "4": { "ident": "tank", "id": 4, "type": "class" },
            "5": { "ident": "support", "id": 5, "type": "class" },
            "6": { "ident": "marksman", "id": 6, "type": "class" },
            "7": { "ident": "mage", "id": 7, "type": "class" },
            "8": { "ident": "control", "id": 8, "type": "class" },
            "9": { "ident": "healer", "id": 9, "type": "class" },
            "10": { "ident": "warrior", "id": 10, "type": "class" },
            "11": { "ident": "boss", "id": 11, "type": "trait" },
            "12": { "ident": "undead", "id": 12, "type": "trait" },
            "13": { "ident": "engineer", "id": 13, "type": "trait" },
            "14": { "ident": "grove_keeper", "id": 14, "type": "trait" },
            "15": { "ident": "energyOverride", "id": 15, "type": "utility" },
            "16": { "ident": "blessed", "id": 16, "type": "trait" },
            "17": { "ident": "nightmare", "id": 17, "type": "utility" },
            "18": { "ident": "scorching", "id": 18, "type": "trait" },
            "19": { "ident": "summoned", "id": 19, "type": "utility" },
            "20": { "ident": "use_small_stone_cage", "id": 20, "type": "utility" },
            "21": { "ident": "use_side_stone_cage", "id": 21, "type": "utility" },
            "22": { "ident": "use_large_stone_cage", "id": 22, "type": "utility" }
        };

        // Dynamically generate allHeroSkins from lib.skin data
        const allHeroSkins = {};
        const skinData = lib.getData('skin');
        for (const skinId in skinData) {
            const skin = skinData[skinId];
            const heroId = skin.heroId;
            const numHeroId = parseInt(heroId, 10);

            // Constrain Hero ID to be between 1 and 68 and check if the skin is enabled.
            if (skin.enabled !== 0 && heroId && numHeroId >= 1 && numHeroId <= 68) {
                if (!allHeroSkins[heroId]) {
                    allHeroSkins[heroId] = [];
                }
                allHeroSkins[heroId].push(skinId);
            }
        }

        // Sort skins for each hero by their sortIndex
        for (const heroId in allHeroSkins) {
            allHeroSkins[heroId].sort((a, b) => {
                const skinA = skinData[a];
                const skinB = skinData[b];
                // Handle cases where sortIndex might not exist, defaulting to 0
                const sortIndexA = skinA?.sortIndex ?? 0;
                const sortIndexB = skinB?.sortIndex ?? 0;
                return sortIndexA - sortIndexB;
            });
        }

        // Fetch data concurrently if possible
        const [playerHeroData, staticHeroData] = await Promise.all([
            new Caller('heroGetAll').execute(),
            Promise.resolve(lib.getData('hero'))
        ]);

        const heroes = Object.values(playerHeroData);

        if (!heroes || heroes.length === 0) {
            console.error("No hero data was retrieved from the API.");
            return;
        }

        // Pre-calculate maximums more efficiently
        const maxSkins = Math.max(...Object.values(allHeroSkins).map(skins => skins.length));

        // Pre-process all perks to avoid repeated filtering
        const heroPerks = heroes.map(hero => {
            const perks = (hero.perks || []).map(id => heroPerk[id]).filter(p => p && p.type !== 'utility');
            return {
                hero,
                gender: perks.filter(p => p.type === 'gender'),
                classes: perks.filter(p => p.type === 'class'),
                traits: perks.filter(p => p.type === 'trait')
            };
        });

        const maxClasses = Math.max(...heroPerks.map(hp => hp.classes.length));
        const maxTraits = Math.max(...heroPerks.map(hp => hp.traits.length));

        const staticHeroIds = Object.keys(staticHeroData).filter(id => {
            const numId = parseInt(id, 10);
            return numId >= 1 && numId <= 68;
        });

        const maxStarLevel = staticHeroIds.length > 0 ?
            Math.max(...staticHeroIds.map(id => Object.keys(staticHeroData[id].stars || {}).length)) : 0;
        const maxColorLevel = staticHeroIds.length > 0 ?
            Math.max(...staticHeroIds.map(id => Object.keys(staticHeroData[id].color || {}).length)) : 0;

        // Generate headers using more functional approach
        const generateHeaders = (prefix, count, suffix = '') =>
            Array.from({length: count}, (_, i) => `${prefix}${i + 1}${suffix}`);

        const skinHeaders = generateHeaders('skin', maxSkins).flatMap(base => [`${base}Id`, `${base}Level`]);
        const classHeaders = generateHeaders('class', maxClasses);
        const traitHeaders = generateHeaders('trait', maxTraits);

        const staticHeaders = ['mainStat', 'battleOrder', 'role'];
        const baseStatsHeaders = [
            'baseStats_agility', 'baseStats_hp', 'baseStats_intelligence',
            'baseStats_physicalAttack', 'baseStats_strength'
        ];

        const statFields = [
            'agility', 'armor', 'armorPenetration', 'dodge', 'hp',
            'intelligence', 'lifesteal', 'magicPenetration', 'magicPower',
            'magicResist', 'physicalAttack', 'physicalCritChance', 'strength'
        ];

        const starHeaders = generateHeaders('star', maxStarLevel).flatMap(base =>
            statFields.map(stat => `${base}_${stat}`)
        );

        const colorItemsHeaders = generateHeaders('color', maxColorLevel, '_items');
        const colorStatsHeaders = generateHeaders('color', maxColorLevel).flatMap(base =>
            statFields.map(stat => `${base}_${stat}`)
        );

        const allHeaders = [
            "id", "name", "xp", "level", "color", "power", "star", "slots", "gender",
            ...classHeaders, ...traitHeaders, "titanCoinsSpent",
            "skill1Id", "skill1Level", "skill2Id", "skill2Level",
            "skill3Id", "skill3Level", "skill4Id", "skill4Level",
            "glyph1", "glyph2", "glyph3", "glyph4", "glyph5",
            "artifact1Level", "artifact1Star", "artifact2Level", "artifact2Star",
            "artifact3Level", "artifact3Star", "ascensionRank", "ascensionNode", "currentSkin", ...skinHeaders,
            ...staticHeaders, ...colorItemsHeaders, "ascensionsCurrentRankNodesDone"
            /* not adding the stats headers - add when adding stats back to export
            ...baseStatsHeaders, ...starHeaders, ...colorStatsHeaders
            */
        ];

        // Helper function for safe value extraction
        const safeValue = (value) => {
            if (value === undefined || value === null || value === "") return "";
            if (Array.isArray(value)) return value.join(';');
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
        };

        // Helper function to capitalize first letter
        const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

        // Build CSV content
        let csvContent = allHeaders.join('\t') + '\n';

        heroPerks.forEach(({hero, gender, classes, traits}) => {
            const staticHero = staticHeroData[String(hero.id)] || {};
            const rowData = [];

            // Basic hero data
            rowData.push(
                hero.id || '',
                cheats.translate("LIB_HERO_NAME_" + hero.id) || `Unknown: LIB_HERO_NAME_${hero.id}`,
                hero.xp || '',
                hero.level || '',
                (Object.keys(hero.slots || {}).length === 6) ? hero.color + 1 : hero.color,
                hero.power || '',
                hero.star || '',
                `${Object.keys(hero.slots || {}).length}/6`,
                gender.length > 0 ? capitalize(gender[0].ident) : ""
            );

            // Dynamic class and trait headers
            for (let i = 0; i < maxClasses; i++) {
                rowData.push(classes[i] ? capitalize(classes[i].ident) : "X");
            }
            for (let i = 0; i < maxTraits; i++) {
                rowData.push(traits[i] ? capitalize(traits[i].ident) : "X");
            }

            // Titan coins - simplified logic
            const titanCoins = hero.titanCoinsSpent?.consumable ?
                Object.values(hero.titanCoinsSpent.consumable)[0] || 0 :
                hero.titanCoinsSpent || 0;
            rowData.push(titanCoins);

            // Skills
            const skillKeys = Object.keys(hero.skills || {});
            for (let i = 0; i < 4; i++) {
                const skillId = skillKeys[i];
                rowData.push(skillId || '', skillId ? hero.skills[skillId] : '');
            }

            // Runes/Glyphs
            for (let i = 0; i < 5; i++) {
                rowData.push(hero.runes?.[i] ?? '');
            }

            // Artifacts
            for (let i = 0; i < 3; i++) {
                rowData.push(
                    hero.artifacts?.[i]?.level ?? "",
                    hero.artifacts?.[i]?.star ?? ""
                );
            }

            // Ascensions
            const ascensions = hero.ascensions || {};
            const ranks = Object.keys(ascensions);
            const lastRank = ranks.length > 0 ? Math.max(...ranks.map(Number)) : null;
            const nodes = lastRank !== null ? ascensions[lastRank] || [] : [];
            const highestNode = nodes.length > 0 ? Math.max(...nodes) : null;
            const nodeCount = nodes.length;
            rowData.push(lastRank, nodeCount);

            // Current skin
            rowData.push(hero.currentSkin || "");

            // All skins
            const heroSkins = allHeroSkins[hero.id] || [];
            for (let i = 0; i < maxSkins; i++) {
                const skinId = heroSkins[i];
                if (skinId && hero.skins?.[skinId] !== undefined) {
                    rowData.push(skinId, hero.skins[skinId]);
                } else {
                    rowData.push('', '');
                }
            }

            // Static data
            rowData.push(
                staticHero.mainStat || '',
                staticHero.battleOrder || '',
                staticHero.role || ''
            );

            // Color items
            // Replace your current colorItems code with this:
            for (let i = 1; i <= maxColorLevel; i++) {
                const items = staticHero.color?.[String(i)]?.items || [];
                rowData.push(items.join(';'));
            }

            // All Raw Nodes
            rowData.push(nodes.map((value, index) => `${index}:${value}`).join(';'));

/* For now we won't process stats schema in the export - it may be useful later, but now it just makes the export too big.
            // Base stats
            const baseStats = staticHero.baseStats || {};
            rowData.push(
                baseStats.agility || 0,
                baseStats.hp || 0,
                baseStats.intelligence || 0,
                baseStats.physicalAttack || 0,
                baseStats.strength || 0
            );

            // Star stats
            for (let i = 1; i <= maxStarLevel; i++) {
                const starData = staticHero.stars?.[i]?.battleStatData || {};
                statFields.forEach(stat => rowData.push(starData[stat] || 0));
            }

            // Color stats
            for (let i = 1; i <= maxColorLevel; i++) {
                const colorData = staticHero.color?.[i]?.battleStatData || {};
                statFields.forEach(stat => rowData.push(colorData[stat] || 0));
            }
*/
            csvContent += rowData.map(safeValue).join('\t') + '\n';
        });

        copyToClipboard(csvContent, "Heroes");
        setProgress(I18N('HEROES_EXPORT_COPY'), true);
    } catch (error) {
        console.error("An error occurred during data processing:", error);
    }
}


/* Titans Data Export */
async function exportTitansData() {
    console.log("Starting Titan data retrieval and conversion...");
    try {
        // Step 1: Retrieve the raw titan data from the game API.
        const titanData = await new Caller('titanGetAll').execute();

        // Convert the titan data object into an array of titan objects for easier iteration.
        const titans = Object.values(titanData);

        if (!titans || titans.length === 0) {
            console.error("No titan data was retrieved from the API.");
            return;
        }

        // Step 2: Determine the maximum number of skills, skins, and artifacts across all titans.
        // This is crucial for creating a dynamic header that can accommodate all titans without
        // missing data or creating unnecessary columns.
        let maxSkills = 0;
        let maxSkins = 0;
        let maxArtifacts = 0;

        titans.forEach(titan => {
            // Update the maximum counts based on the current titan's data
            maxSkills = Math.max(maxSkills, Object.keys(titan.skills || {}).length);
            maxSkins = Math.max(maxSkins, Object.keys(titan.skins || {}).length);
            maxArtifacts = Math.max(maxArtifacts, (titan.artifacts || []).length);
        });

        // Generate dynamic header strings for skills, skins, and artifacts.
        const skillHeaders = [];
        for (let i = 1; i <= maxSkills; i++) {
            skillHeaders.push(`skill${i}Id`);
            skillHeaders.push(`skill${i}Level`);
        }

        const skinHeaders = [];
        for (let i = 1; i <= maxSkins; i++) {
            skinHeaders.push(`skin${i}Id`);
            skinHeaders.push(`skin${i}Level`);
        }

        const artifactHeaders = [];
        for (let i = 1; i <= maxArtifacts; i++) {
            artifactHeaders.push(`artifact${i}Level`);
            artifactHeaders.push(`artifact${i}Star`);
        }

        // Step 3: Define the final headers for the CSV file.
        // The order of these headers determines the order of the columns in the output.
        const headers = [
            "id", "name", "xp", "level", "star", "power", "currentSkin",
            ...skillHeaders,
            ...skinHeaders,
            ...artifactHeaders
        ];

        const csvRows = [headers.join('\t')]; // Initialize the CSV with the header row

        // Step 4: Iterate through each titan and create a new row for the CSV.
        titans.forEach(titan => {
            const rowData = [];

            // Iterate over each header to build the row data in the correct order.
            headers.forEach(header => {
                let value;

                // === PARSING LOGIC START ===
                // This section contains logic to correctly extract data from complex titan object properties.
                if (header === 'name') {
                    // Use a translation key to get the Titan's name.
                    value = cheats.translate("LIB_HERO_NAME_" + titan.id);
                    if (!value) {
                        value = `Unknown: LIB_HERO_NAME_${titan.id}`;
                    }
                } else if (header.startsWith('skill')) {
                    const skillIndex = parseInt(header.match(/\d/)[0], 10) - 1;
                    const skillKeys = Object.keys(titan.skills || {});
                    const skillId = skillKeys[skillIndex];
                    if (header.includes('Id')) {
                        value = skillId || "";
                    } else { // header includes 'Level'
                        value = skillId ? titan.skills[skillId] : "";
                    }
                } else if (header.startsWith('skin')) {
                    const skinIndex = parseInt(header.match(/\d/)[0], 10) - 1;
                    const skinKeys = Object.keys(titan.skins || {});
                    const skinId = skinKeys[skinIndex];
                    if (skinId) {
                        if (header.includes('Id')) {
                            value = skinId;
                        } else { // header includes 'Level'
                            value = titan.skins[skinId];
                        }
                    } else {
                        value = "X"; // "X" to denote a missing skin slot
                    }
                } else if (header.startsWith('artifact')) {
                    const artifactIndex = parseInt(header.match(/\d/)[0], 10) - 1;
                    const prop = header.includes('Level') ? 'level' : 'star';
                    value = (titan.artifacts && titan.artifacts[artifactIndex]) ? titan.artifacts[artifactIndex][prop] : "";
                } else {
                    // For simple headers, just get the value directly from the titan object.
                    value = titan[header];
                }
                // === PARSING LOGIC END ===

                // Handle undefined, null, or empty values by pushing an empty string.
                if (value === undefined || value === null || value === "") {
                    rowData.push("");
                } else {
                    // Handle complex data types by stringifying them.
                    if (Array.isArray(value)) {
                        rowData.push(value.join(';'));
                    } else if (typeof value === 'object') {
                        rowData.push(JSON.stringify(value));
                    } else {
                        // For all other values, convert to a string.
                        rowData.push(String(value));
                    }
                }
            });
            csvRows.push(rowData.join('\t'));
        });

        const csvContent = csvRows.join('\n');

        // Step 5: Copy the final CSV content to the clipboard.
    	copyToClipboard(csvContent, "Titans");

    } catch (error) {
        console.error("An error occurred during data processing:", error);
    }
    setProgress(I18N('TITANS_EXPORT_COPY'), true);

}

/* Inventory Data Export */
/**
 * Pulls information from player's Inventory and the game library inventory data to create a comprehensive inventory data sheet.
 * creates unique ids for the inventory - that way we can pull the data easier from other sheets.
 */
async function exportInventoryData() {

	try {
		const userResponse = await Caller.send('userGetInfo');
		if (!userResponse) {
			console.error("Failed to retrieve user info.");
			return;
		}
		const goldAmount = userResponse.gold;
		const emeraldAmount = userResponse.starMoney;

		const inventoryData = await Caller.send('inventoryGet');
		if (!inventoryData) {
			console.error("Failed to retrieve inventory data.");
			return;
		}
		const inventoryItemData = lib.getData('inventoryItem');
		if (!inventoryItemData) {
			console.error("Inventory item data not found. Please ensure 'lib.getData('inventoryItem')' returns a valid object.");
			return;
		}

		// A map to hold all unique item IDs we need to process, to prevent duplicates and ensure all fragments are included.
		const itemsToProcess = new Map();

		// Add all items from the master item data. This is the primary source of all possible items.
		for (const categoryName in inventoryItemData) {
			const category = inventoryItemData[categoryName];
			for (const itemId in category) {
				const uniqueId = `${categoryName}-${itemId}`;
				itemsToProcess.set(uniqueId, { categoryName, itemId });
			}
		}

		// Add all items from the user's actual inventory, in case the master list is missing entries.
		// This is a defensive measure to ensure all fragments are included.
		for (const categoryName in inventoryData) {
			const category = inventoryData[categoryName];
			for (const itemId in category) {
				const uniqueId = `${categoryName}-${itemId}`;
				itemsToProcess.set(uniqueId, { categoryName, itemId });
			}
		}

		const allItems = [];

		// Handle pseudo items first
		let goldTranslationKey = 'LIB_PSEUDO_COIN';
		let goldItemName = cheats.translate(goldTranslationKey);
		allItems.push([
			'00000002', // Unique ID for gold
			'pseudo',
			goldItemName,
			goldAmount,
			0, // Fragment Amount for gold is 0
			0, // Can Craft
			'gold',
			goldTranslationKey,
			'', '', '', '', '', '', '', ''
		]);

		let emeraldTranslationKey = 'LIB_PSEUDO_STARMONEY';
		let emeraldItemName = cheats.translate(emeraldTranslationKey);
		allItems.push([
			'00000001', // Unique ID for emeralds
			'pseudo',
			emeraldItemName,
			emeraldAmount,
			0, // Fragment Amount for emeralds is 0
			0, // Can Craft
			'emerald',
			emeraldTranslationKey,
			'', '', '', '', '', '', '', ''
		]);

		// Now, iterate through the consolidated list of all unique items to process.
		itemsToProcess.forEach((itemInfo) => {
			const { categoryName, itemId } = itemInfo;
			const currentItemData = inventoryItemData[categoryName]?.[itemId];

			let prefix = '';
			let keyPrefix;
			let fragmentCount = 0;
			let finalCount = inventoryData[categoryName]?.[itemId] || 0;

			// Logic for unique IDs and prefixes is now universal, ensuring it always applies.
			switch (categoryName) {
				case 'coin':
					prefix = '1100';
					keyPrefix = 'COIN';
					break;
				case 'consumable':
					prefix = '1200';
					keyPrefix = 'CONSUMABLE';
					break;
				case 'gear':
					prefix = '1300';
					keyPrefix = 'GEAR';
					fragmentCount = inventoryData.fragmentGear?.[itemId] || 0;
					break;
				case 'fragmentGear':
					prefix = '1400';
					keyPrefix = 'GEAR';
					fragmentCount = finalCount;
					break;
				case 'scroll':
					prefix = '1500';
					keyPrefix = 'SCROLL';
					fragmentCount = inventoryData.fragmentScroll?.[itemId] || 0;
					break;
				case 'fragmentScroll':
					prefix = '1600';
					keyPrefix = 'SCROLL';
					fragmentCount = finalCount;
					break;
				case 'fragmentHero':
					prefix = '1700';
					keyPrefix = 'HERO';
					fragmentCount = finalCount;
					break;
				case 'fragmentArtifact':
					prefix = '1800';
					keyPrefix = 'ARTIFACT';
					fragmentCount = finalCount;
					break;
				case 'ascensionGear':
					prefix = '1900';
					keyPrefix = 'ASCENSION_GEAR';
					break;
				case 'fragmentPet':
					prefix = '2000';
					keyPrefix = 'HERO';
					fragmentCount = finalCount;
					break;
				case 'petGear':
					prefix = '2100';
					keyPrefix = 'PET_GEAR';
					break;
				case 'fragmentTitanArtifact':
					prefix = '2200';
					keyPrefix = 'TITAN_ARTIFACT';
					fragmentCount = finalCount;
					break;
				case 'bannerStone':
					prefix = '2300';
					keyPrefix = 'BANNER_STONE';
					break;
				case 'fragmentTitan':
					prefix = '2400';
					keyPrefix = 'HERO'; // Changed from 'TITAN' to 'HERO'
					fragmentCount = finalCount;
					break;
				default:
					prefix = '9999';
					keyPrefix = categoryName.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '');
					break;
			}

			const processedItemId = String(itemId).length > 4 ? String(itemId).slice(-4) : itemId;
			const uniqueId = `${prefix}${String(processedItemId).padStart(4, '0')}`;

			let translationKey = `LIB_${keyPrefix}_NAME_${processedItemId}`;

			if (translationKey === 'LIB_COIN_NAME_1417001093') {
				translationKey = 'LIB_COIN_NAME_1093';
			}

			let itemName = cheats.translate(translationKey);
			if (!itemName) {
				itemName = `Unknown: ${translationKey}`;
			}

			if (categoryName === 'fragmentHero' || categoryName === 'fragmentPet' || categoryName === 'fragmentTitan') {
				itemName = `${itemName} Soul Stones`;
			} else if (categoryName.includes('fragment')) {
				itemName = `Fragment of ${itemName}`;
			}

			let mergeCostFragments = '';
			let mergeCostGold = '';
			let madeWithItems = '';
			let madeWithRecipe = '';
			let craftingCost = '';
			let sellCost = '';
			let fragmentSellCost = '';
			let requiredLevel = '';
			let color = '';
			let canCraft = 0;

			// Only populate these values if the item exists in the master list.
			if (currentItemData) {
				sellCost = currentItemData.sellCost?.gold || '';
				fragmentSellCost = currentItemData.fragmentSellCost?.gold || '';
				requiredLevel = currentItemData.heroLevel || '';
				color = currentItemData.color || '';

				switch (color) {
					case 1: color = 'White'; break;
					case 2: color = 'Green'; break;
					case 3: color = 'Blue'; break;
					case 4: color = 'Violet'; break;
					case 5: color = 'Orange'; break;
					case 6: color = 'Red'; break;
					default: color = ''; break;
				}

				if (categoryName === 'gear' && currentItemData.craftRecipe) {
					if (currentItemData.craftRecipe.gear) {
						madeWithItems = Object.entries(currentItemData.craftRecipe.gear).map(([id, value]) => `${id}:${value}`).join(';');
					}
					if (currentItemData.craftRecipe.scroll) {
						madeWithRecipe = Object.entries(currentItemData.craftRecipe.scroll).map(([id, value]) => `${id}:${value}`).join(';');
					}
					craftingCost = currentItemData.craftRecipe.gold || '';
				}

				if ((categoryName === 'gear' || categoryName === 'scroll') && currentItemData.fragmentMergeCost) {
					mergeCostFragments = currentItemData.fragmentMergeCost.fragmentCount || '';
					mergeCostGold = currentItemData.fragmentMergeCost.gold || '';
				}

				canCraft = (fragmentCount && mergeCostFragments) ? Math.floor(fragmentCount / mergeCostFragments) : 0;
			}

			// We only want to export items we actually own or are fragments of items we own
			if (finalCount > 0 || fragmentCount > 0) {
				allItems.push([
					uniqueId,
					categoryName,
					itemName,
					finalCount,
					fragmentCount,
					canCraft,
					processedItemId,
					translationKey,
					mergeCostFragments,
					mergeCostGold,
					madeWithItems,
					madeWithRecipe,
					craftingCost,
					sellCost,
					fragmentSellCost,
					requiredLevel,
					color
				]);
			}
		});

		if (allItems.length > 0) {
			allItems.sort((a, b) => {
				const uniqueIdA = parseInt(String(a[0]).replace(/[^0-9]/g, ''), 10);
				const uniqueIdB = parseInt(String(b[0]).replace(/[^0-9]/g, ''), 10);
				return uniqueIdA - uniqueIdB;
			});

			const header = ['Unique ID', 'Category', 'Name', 'Amount', 'Fragment Amount', 'Can Craft', 'ID', 'Key', 'Merge Cost Fragments', 'Merge Cost Gold', 'Made with Items', 'Made with Recipe', 'Crafting Cost', 'Sell Cost', 'Fragment Sell Cost', 'Required Level', 'Color'].join('\t');
			const formattedItems = allItems.map(e => e.join('\t')).join('\n');
			const output = header + '\n' + formattedItems;

			copyToClipboard(output, "Inventory");

		} else {
			console.log("Inventory data is empty.");
		}
	} catch (error) {
		console.error("Failed to retrieve inventory data or translate keys:", error);
	}
    setProgress(I18N('INVENTORY_EXPORT_COPY'), true);
}

/* skin info export */
async function exportSkinData() {
  try {
    // Step 1: Retrieve the skin data object.
    const jsonData = this.lib.getData('skin');

    // Log the raw data object to the console for a quick check.
    console.log("Raw skin data object:", jsonData);

    const processedData = [];

    // Filter out skins where 'enabled' is 0 AND where 'heroId' is not between 1 and 68.
    const enabledSkins = Object.values(jsonData).filter(skin => skin.enabled === 1 && skin.heroId >= 1 && skin.heroId <= 68);

    if (enabledSkins.length === 0) {
      console.log("No enabled skin data found to process.");
      return;
    }

    // Sort the filtered skins first by Hero ID, then by Sort Index.
    enabledSkins.sort((a, b) => {
      if (a.heroId !== b.heroId) {
        return a.heroId - b.heroId;
      }
      // Corrected sorting: sort by sortIndex as the secondary key.
      return a.sortIndex - b.sortIndex;
    });

    // Safely get the stat name from the first enabled object.
    const firstSkin = enabledSkins[0];
    const firstLevel = Object.values(firstSkin.statData.levels)[0];
    const statName = Object.keys(firstLevel.statBonus)[0];

    // Define the header row with dynamic stat names.
    processedData.push([
      "ID", "Name", "Hero ID", "Hero Name", "Sort Index", "Is Default", "Stat Short", "Stat", "Stat Name", "Total Stat Bonus", "Total Coin Cost", "Asset", "Icon Asset", "Icon Atlas", "Locale Key", "Enabled"
    ]);

    // Create mappings for stat short names and full names.
    const statShortMap = {
      agility: "AG",
      strength: "S",
      intelligence: "I",
      dodge: "D",
      hp: "H",
      armor: "A",
      magicPower: "MA",
      magicResist: "MD",
      magicPenetration: "MP",
      physicalAttack: "PA",
      armorPenetration: "AP",
      physicalCritChance: "CHC",
      "N/A": "AO"
    };

    const statFullMap = {
      agility: "Agility",
      strength: "Strength",
      intelligence: "Intelligence",
      dodge: "Dodge",
      hp: "Health",
      armor: "Armor",
      magicPower: "Magic Attack",
      magicResist: "Magic Defense",
      magicPenetration: "Magic Penetration",
      physicalAttack: "Physical Attack",
      armorPenetration: "Armor Penetration",
      physicalCritChance: "Critical Hit Chance",
      "N/A": "Appearance Only"
    };

    // Loop through each enabled skin object.
    for (const item of enabledSkins) {
      // Call the external translation function and remove " Skin".
      const name = cheats.translate(item.localeKey).replace(' Skin', '');

      // Call the external translation function to get the hero's name.
      const heroName = cheats.translate("LIB_HERO_NAME_" + item.heroId);

      let totalCoinCost = 0;
      let totalStatBonus = 0;
      let statName = "N/A";
      let statShort = "AO";

      const levels = item.statData.levels;
      for (const levelKey in levels) {
        if (levels.hasOwnProperty(levelKey)) {
          // Check if 'cost' and 'cost.coin' exist before accessing.
          if (levels[levelKey].cost && levels[levelKey].cost.coin) {
            totalCoinCost += Object.values(levels[levelKey].cost.coin)[0];
          }
          const statBonusObj = levels[levelKey].statBonus;
          const currentStatName = Object.keys(statBonusObj)[0];
          if (currentStatName) {
            statName = currentStatName;
            statShort = statShortMap[statName] || "AO";
            totalStatBonus += statBonusObj[currentStatName];
          }
        }
      }

      const statTranslatedName = statFullMap[statName] || "Appearance Only";

      processedData.push([
        item.id,
        name,
        item.heroId,
        heroName,
        item.sortIndex,
        item.isDefault,
        statShort,
        statName,
        statTranslatedName,
        totalStatBonus,
        totalCoinCost,
        item.asset,
        item.iconAsset,
        item.iconAtlas,
        item.localeKey,
        item.enabled,
      ]);
    }

    // Convert the 2D array to a tab-delimited string.
    const tabbedData = processedData.map(row => row.join('\t')).join('\n');

    // Copy the data to the clipboard.
    copyToClipboard(tabbedData, "Skin");
    setProgress(I18N('HERO_SKIN_DATA_COPY'), true);

  } catch (error) {
    console.error("An error occurred during test:", error);
  }
}
/* pets */
async function exportPetsData() {
    console.log("Starting pet data retrieval and conversion...");

    try {
        // Step 1: Retrieve the raw pet data from the game API.
        const petData = await new Caller('pet_getAll').execute();

        // Convert the pet data object into an array of pet objects for easier iteration.
        let pets = Object.values(petData);

        if (!pets || pets.length === 0) {
            console.error("No pet data was retrieved from the API.");
            return;
        }

        // Step 2: Sort the pets array.
        // Primary sort by ID (ascending), secondary sort by Power (descending).
        pets.sort((a, b) => {
            if (a.id !== b.id) {
                return a.id - b.id; // Sort by ID ascending
            }
            return b.power - a.power; // If IDs are the same, sort by power descending
        });

        // Pet ID to name mapping based on the provided schema.
        const petNames = {
            6000: "Fenris",
            6001: "Oliver", 6002: "Merlin", 6003: "Mara",
            6004: "Cain", 6005: "Albus", 6006: "Axel",
            6007: "Biscuit", 6008: "Khorus", 6009: "Vex"
        };

        // Step 3: Define the final headers for the CSV file.
        const headers = [
            "Id", "Name", "Power", "Color", "Star", "XP", "Level",
            "Slot1", "Slot2", "Slot3", "Slot4", "Slot5", "Slot6"
        ];

        const csvRows = [headers.join('\t')]; // Initialize the CSV with the header row

        // Step 4: Iterate through each pet and create a new row for the CSV.
        pets.forEach(pet => {
            const rowData = [];

            // Iterate over each header to build the row data in the correct order.
            headers.forEach(header => {
                let value;

                // === PARSING LOGIC START ===
                if (header === 'Name') {
                    value = petNames[pet.id] || `Unknown: ${pet.id}`;
                } else if (header.startsWith('Slot')) {
                    const slotIndex = parseInt(header.replace('Slot', ''), 10) - 1;
                    value = pet.slots[slotIndex] !== undefined ? pet.slots[slotIndex] : "X";
                } else {
                    // For simple headers, just get the value directly from the pet object.
                    value = pet[header.toLowerCase()];
                }
                // === PARSING LOGIC END ===

                // Handle undefined, null, or empty values by pushing an empty string.
                if (value === undefined || value === null || value === "") {
                    rowData.push("");
                } else {
                    // Convert all values to a string.
                    rowData.push(String(value));
                }
            });
            csvRows.push(rowData.join('\t'));
        });

        const csvContent = csvRows.join('\n');

        // Step 5: Copy the final CSV content to the clipboard.
        copyToClipboard(csvContent, "Pets");

    } catch (error) {
        console.error("An error occurred during data processing:", error);
    }
    setProgress(I18N('PETS_EXPORT_COPY'), true);
}

/* totems */
async function exportTotemsData() {
    console.log("Starting totem data retrieval and conversion...");

    try {
        // Step 1: Retrieve the raw totem data from the game API.
        const totemData = await new Caller('titanSpirit_getAll').execute();

        // Convert the totem data object into an array of totem objects for easier iteration.
        // We also add the "name" property based on the object's key.
        const totems = Object.keys(totemData).map(key => {
            return {
                name: key.charAt(0).toUpperCase() + key.slice(1),
                ...totemData[key]
            };
        });

        if (!totems || totems.length === 0) {
            console.error("No totem data was retrieved from the API.");
            return;
        }

        // Step 2: Define the final headers for the CSV file.
        const headers = [
            "ID", "Name", "Star", "Level", "Elemental Skill", "Elemental Skill Level",
            "Primal Skill", "Primal Skill Level", "Last Roll Elemental",
            "Last Roll Primal", "Skill Bad Luck"
        ];

        const csvRows = [headers.join('\t')]; // Initialize the CSV with the header row

        // Step 3: Iterate through each totem and create a new row for the CSV.
        totems.forEach(totem => {
            const rowData = [];

            // Get the elemental skill ID and level, or default to 0.
            const elementalSkillId = totem.elementalSkill ? Object.keys(totem.elementalSkill)[0] : 0;
            const elementalSkillLevel = totem.elementalSkill ? Object.values(totem.elementalSkill)[0] : 0;

            // Get the primal skill ID and level, or default to 0.
            const primalSkillId = totem.primalSkill ? Object.keys(totem.primalSkill)[0] : 0;
            const primalSkillLevel = totem.primalSkill ? Object.values(totem.primalSkill)[0] : 0;

            // Iterate over each header to build the row data in the correct order.
            headers.forEach(header => {
                let value;

                // === PARSING LOGIC START ===
                if (header === "ID") {
                    value = totem.id;
                } else if (header === "Name") {
                    value = totem.name;
                } else if (header === "Star") {
                    value = totem.star;
                } else if (header === "Level") {
                    value = totem.level;
                } else if (header === "Elemental Skill") {
                    value = elementalSkillId;
                } else if (header === "Elemental Skill Level") {
                    value = elementalSkillLevel;
                } else if (header === "Primal Skill") {
                    value = primalSkillId;
                } else if (header === "Primal Skill Level") {
                    value = primalSkillLevel;
                } else if (header === "Last Roll Elemental") {
                    value = totem.lastRoll?.elementalSkill ? Object.keys(totem.lastRoll.elementalSkill)[0] : 0;
                } else if (header === "Last Roll Primal") {
                    value = totem.lastRoll?.primalSkill ? Object.keys(totem.lastRoll.primalSkill)[0] : 0;
                } else if (header === "Skill Bad Luck") {
                    value = totem.skillBadLuck;
                }
                // === PARSING LOGIC END ===

                // Handle undefined, null, or empty values by pushing an empty string.
                if (value === undefined || value === null || value === "") {
                    rowData.push("");
                } else {
                    // Convert all values to a string.
                    rowData.push(String(value));
                }
            });
            csvRows.push(rowData.join('\t'));
        });

        const csvContent = csvRows.join('\n');

        // Step 4: Copy the final CSV content to the clipboard.
        copyToClipboard(csvContent, "Totems");

    } catch (error) {
        console.error("An error occurred during data processing:", error);
    }
    setProgress(I18N('TOTEMS_EXPORT_COPY'), true);
}
/* wisdom tree data */

async function exportWisdomTreeData() {
    console.log("Starting Wisdom Tree data retrieval and conversion...");

    try {
        // Step 1: Retrieve the raw Wisdom Tree data from the game API.
        const wisdomTreeData = await new Caller('roleAscension_getAll').execute();

        // Step 2: Convert the data object into a sorted array of objects.
        const roles = Object.values(wisdomTreeData).sort((a, b) => a.id - b.id);

        if (!roles || roles.length === 0) {
            console.error("No Wisdom Tree data was retrieved from the API.");
            return;
        }

        // Step 3: Define the ID to Name mapping.
        const roleNames = {
            1: "Mage",
            2: "Tank",
            3: "Marksman",
            4: "Healer",
            5: "Support",
            6: "Warrior",
            7: "Control"
        };

        // Step 4: Define the final headers for the CSV file.
        const headers = ["ID", "Name", "Level"];
        const csvRows = [headers.join('\t')];

        // Step 5: Iterate through each role and create a new row for the CSV.
        roles.forEach(role => {
            const rowData = [];
            rowData.push(role.id);
            rowData.push(roleNames[role.id] || "Unknown");
            rowData.push(role.level);
            csvRows.push(rowData.join('\t'));
        });

        const csvContent = csvRows.join('\n');

        // Step 6: Copy the final CSV content to the clipboard.
        copyToClipboard(csvContent, "Wisdom Tree");

    } catch (error) {
        console.error("An error occurred during data processing:", error);
    }
    setProgress(I18N('WISDOM_EXPORT_COPY'), true);
}
/* End Function */
})();