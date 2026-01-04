// ==UserScript==
// @name			fixoraclecards for Hero Wars Helper
// @name:en			fixoraclecards for Hero Wars Helper
// @name:ru			fixoraclecards for Hero Wars Helper
// @namespace		fixoraclecards for Hero Wars Helper
// @version			0.0.3
// @description		fixoraclecards for HeroWarsHelper script
// @description:en	fixoraclecards for HeroWarsHelper script
// @description:ru	fixoraclecards для скрипта HeroWarsHelper
// @author			ZingerY & Orb
// @license 		Copyright ZingerY
// @homepage		https://zingery.ru/scripts/HWHBestDungeonExt.user.js
// @icon			https://zingery.ru/scripts/VaultBoyIco16.ico
// @icon64			https://zingery.ru/scripts/VaultBoyIco64.png
// @match			https://www.hero-wars.com/*
// @match			https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/538202/fixoraclecards%20for%20Hero%20Wars%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/538202/fixoraclecards%20for%20Hero%20Wars%20Helper.meta.js
// ==/UserScript==

(function () {
	if (!this.HWHClasses) {
		console.log('%cObject for extension not found', 'color: red');
		return;
	}
	if (!this.HWHData) {
		console.log('HWHData not found');
	} else {console.log('HWHDataLoaded')}

	console.log('%cStart Extension ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: red');
	const { addExtentionName } = HWHFuncs;
	addExtentionName(GM_info.script.name, GM_info.script.version, GM_info.script.author);

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
		setIsCancalBattle,
		random,
		EventEmitterMixin,
	} = HWHFuncs;
	const executeDungeon = HWHClasses;


    executeDungeon.Prototype.endBattle = async function (battleInfo) {
		if (battleInfo.result.win) {
			const args = {
				result: battleInfo.result,
				progress: battleInfo.progress,
			}
			if (HWHData.countPredictionCard > 0) {
				args.isRaid = true;
			} else {
				const timer = getTimer(battleInfo.battleTime);
				console.log(timer);
				await countdownTimer(timer, `${I18N('DUNGEON')}: ${I18N('TITANIT')} ${dungeonActivity}/${maxDungeonActivity} ${talentMsg}`);
			}
			const calls = [{
				name: "dungeonEndBattle",
				args,
				ident: "body"
			}];
			lastDungeonBattleData = null;
			try {send(JSON.stringify({ calls }), resultEndBattle);}
            catch(e) {// Check if error contains "abnormal speed" or "NotAvailable in dungeonEndBattle"
					if (e.message.includes("abnormal speed") || e.message.includes("NotAvailable in dungeonEndBattle")) {
						console.warn("Server detected fast dungeon completion, retrying without raid...");
						HWHData.countPredictionCard = 0; delete args.isRaid; endBattle(battleInfo)}

		 else {
			endDungeon('dungeonEndBattle win: false\n', battleInfo);
		} }}
	}



    })();