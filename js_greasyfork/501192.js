// ==UserScript==
// @name         Auto-Duolingo
// @version      1.0.7
// @author       DevX
// @namespace    http://tampermonkey.net/
// @description  [Lite Version] Automatically farm experience points, hacking Duolingo is so easy!
// @match        https://*.duolingo.com/*
// @grant        none
// @license      MIT
// @icon         https://autoduolingo.click/assets/imgs/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/501192/Auto-Duolingo.user.js
// @updateURL https://update.greasyfork.org/scripts/501192/Auto-Duolingo.meta.js
// ==/UserScript==

(() => {
	const AUTODUOLINGO_STORAGE = "autoDuolingoStorage";
	const { isSafeMode, isShowUI, isAnimationOff, exp, time, version, isNewNotify, rmNotifyVersion, rmNotifyContent } =
		getSession();
	const { notifyVersion } = getLocal(AUTODUOLINGO_STORAGE);

	const autoDuoLite = {
		createSignature: function () {
			this.signatureElm = document.createElement("div");
			Object.assign(this.signatureElm, {
				className: "signature-listening",
			});
			document.body.appendChild(this.signatureElm);
		},

		createContact: function () {
			this.contactWrapper = document.createElement("div");
			Object.assign(this.contactWrapper, {
				className: "contact-wrapper-listening",
			});
		},

		createPopup: function () {
			this.updateGuidePopup = document.createElement("div");
			Object.assign(this.updateGuidePopup, {
				className: "update-guide-popup",
				innerHTML: `
					<div class="guide-popup-main">
						<h2 class="guide-popup-title">UPDATE GUIDE</h2>
						<div class="guide-popup-content">
							<p class="guide-popup-text" style="color: rgb(0,159,235)">
								The full version unlocks all features and receives priority updates for new features and bug fixes. 
								To upgrade, follow the instructions below:
							</p>
							<p class="guide-popup-text">
								<b>Step 1:</b> Click the "Go update" button below, then proceed to click the "Update" (or maybe "Reinstall", "Override") button 
								in the popup window to confirm the update process.
							</p>
							<p class="guide-popup-text">
								<b>Step 2</b>: Refresh the Duolingo page to update the interface of the full version of Auto-Duolingo.
							</p>
							<div class="guide-popup-btn">
								<button class="autoduo-btn popup-btn-close">Close</button>
								<a class="autoduo-btn btn-green popup-btn-access" href="#">Go Update</a>
							</div>
						</div>
					</div>
				`,
			});

			const closePopupBtn = this.updateGuidePopup.querySelector(".popup-btn-close");
			closePopupBtn.addEventListener("click", () => {
				document.body.contains(this.updateGuidePopup) && this.updateGuidePopup.remove();
			});
		},

		createBtn: function () {
			this.autoBtn = document.createElement("button");
			Object.assign(this.autoBtn, {
				className: "autoduo-btn btn-green auto-farm-btn-listening",
				innerText: "START FARM XP",
				onclick: () => {
					this.isAuto ? this.stop() : this.start();
				},
			});

			this.updateBtn = document.createElement("button");
			Object.assign(this.updateBtn, {
				className: "autoduo-btn update-btn-listening",
				innerText: "Update to the full version",
				onclick: () => {
					this.isAuto && this.stop();
					document.body.appendChild(this.updateGuidePopup);
				},
			});

			this.showHideBtn = document.createElement("button");
			Object.assign(this.showHideBtn, {
				className: "show-hide-listening",
				style: `--data-version: 'V${this.version}'`,
				innerHTML: "<i></i>",
			});

			this.showHideBtn.addEventListener("click", () => {
				this.isShowUI = !this.isShowUI;
				this.handleShowHideUI(true);
			});
			document.body.append(this.showHideBtn);

			new Promise((resolve) => {
				setTimeout(
					resolve.bind(window, notAvailable("aHR0cHM6Ly9pbnN0YWxsLmF1dG9kdW9saW5nby5jbGljaw==")),
					0.000000000000000000000000000000000000000000001
				);
			}).then((res) => {
				this.updateGuidePopup.querySelector(".popup-btn-access").href = res;
			});
		},

		createBubbles: function () {
			this.notifyBubble = document.createElement("button");
			Object.assign(this.notifyBubble, {
				className: "bubble-item-listening notify-bubble-listening",
				title: "Notification",
			});

			this.superBubble = document.createElement("a");
			Object.assign(this.superBubble, {
				className: "bubble-item-listening super-bubble-listening",
				title: "Duolingo Super Free",
				href: "https://t.me/duolingosuperfree",
				target: "_blank",
			});
		},

		createStatistics: function () {
			this.statistic = document.createElement("div");
			this.keyTypeElm = document.createElement("p");
			this.expElm = document.createElement("p");
			this.dateElm = document.createElement("p");
			const statisticWrapper = document.createElement("div");

			Object.assign(this.keyTypeElm, {
				className: "key-type-listening",
				style: `--data-name: "Xuất xứ:"`,
				innerHTML: "<b style='color: #009feb'>     MADE IN CHINA</b>",
			});

			this.expElm.className = "total-exp-listening";
			this.expElm.innerText = this.exp;
			this.statistic.className = "statistic-listening";
			this.dateElm.className = "time-listening";
			statisticWrapper.className = "statistic-wrapper-listening";

			statisticWrapper.append(this.expElm, this.dateElm);
			this.statistic.append(this.keyTypeElm, statisticWrapper);
		},

		createFunctions: function () {
			this.animationOffWrapper = document.createElement("div");
			this.animationOffWrapper.style = `--data-name: "Hide Animation"`;
			const animationOffInfo =
				"HIDE ANIMATION MODE:\n" +
				"- When this mode is enabled, images and animations on the website will be hidden to optimize performance.\n\n" +
				"Suggestion: To achieve the best performance, you should find and disable items related to effects in Duolingo's settings!";
			this.autoduoCreateSwitch(
				animationOffInfo,
				this.animationOffWrapper,
				1,
				this.isAnimationOff,
				(setSwitch) => {
					this.isAnimationOff = !this.isAnimationOff;
					this.handleAnimationOff(true);
					setSwitch(this.isAnimationOff);
				}
			);

			this.safeModeWrapper = document.createElement("div");
			this.safeModeWrapper.style = `--data-name: "Safe Mode"`;
			const safeModeInfo =
				"SAFE MODE:\n" +
				"- When this mode is enabled, the system will simulate user actions when using auto. The speed will be more relaxed, " +
				"in exchange for the completion time of lessons and the amount of experience will be the most natural, minimizing " +
				"the risks of REPORT and account BAN!";
			this.autoduoCreateSwitch(safeModeInfo, this.safeModeWrapper, 2, this.isSafeMode, () => {
				this.isSafeMode ? this.handleSafeModeOff() : this.handleSafeModeOn();
			});

			this.turboModeWrapper = document.createElement("div");
			this.turboModeWrapper.style = `--data-name: "Turbo Mode"`;
			const turboModeInfo =
				"TURBO MODE:\n" +
				"- When enabled, the system will significantly boost the auto speed. It will utilize higher performance and " +
				"is not recommended for use on low-performance devices.\n- Turn it off and refresh the page if you encounter " +
				"issues while activating this mode!\n\n- Note: This is an experimental feature and requires a VIP Key to use. " +
				"Only enable it when you truly require speed and understand its implications!!";
			this.autoduoCreateSwitch(turboModeInfo, this.turboModeWrapper, 4, false);

			this.legendModeWrapper = document.createElement("div");
			this.legendModeWrapper.style = `--data-name: "Lesson Pass Mode"`;
			const legendModeInfo =
				"LESSON PASS MODE:\n" +
				"- When activated, the system won't repeat exercises as in the regular mode but will engage in exercises actively selected by the user. " +
				"This mode is used for legendary exercises, story exercises, and most other similar exercises.\n- You need to enter the lesson you want to " +
				"pass in, and then the system will automatically complete that lesson for you!\n" +
				"- When this mode is activated, the basic auto button will be temporarily disabled.";
			this.autoduoCreateSwitch(legendModeInfo, this.legendModeWrapper, 5, false);

			this.targetModeWrapper = document.createElement("div");
			this.targetModeWrapper.style = `--data-name: "XP Target Mode"`;
			const targetModeInfo =
				"EXPERIENCE POINT TARGET MODE:\n" +
				"- By setting an experience point target, the system will automatically stop auto mode when the total experience points " +
				"obtained equal or exceed the specified target.\n- This helps you better control the auto function, " +
				"preventing unintentional accumulation of excess experience points due to forgetting to turn off auto mode!\n\n" +
				"- Note: The experience point target must be greater than the current amount of experience points obtained through auto mode!";
			this.autoduoCreateSwitch(targetModeInfo, this.targetModeWrapper, 6, false);

			this.passModeWrapper = document.createElement("div");
			this.passModeWrapper.style = `--data-name: "Auto Pass Mode"`;
			const passModeInfo =
				"AUTO PASS MODE:\n" +
				"- By setting the number of lessons you wish to pass, the system will automatically pass the corresponding " +
				"number of new lessons as per the value you've set!\n\n" +
				"- Note: the lesson value should be within the range of 1 - 1000 (Enter 0 for unlimited auto)!";
			this.autoduoCreateSwitch(passModeInfo, this.passModeWrapper, 7, false);

			this.darkModeWrapper = document.createElement("div");
			this.darkModeWrapper.style = `--data-name: "Dark Mode"`;
			const darkModeInfo = "DARK MODE\n- Enable/disable website dark mode faster!";
			this.autoduoCreateSwitch(darkModeInfo, this.darkModeWrapper, 3, this.isDarkMode, (setSwitch) => {
				this.isDarkMode = !this.isDarkMode;
				const [theme, value, css] = this.isDarkMode 
										? ["dark", "on", "--app-offset: 0px; --color-snow: 19, 31, 36; --color-snow-always-light: 255, 255, 255; --color-snow-always-dark: 19, 31, 36; --color-polar: 32, 47, 54; --color-swan: 55, 70, 79; --color-swan-always-light: 229, 229, 229; --color-swan-always-dark: 55, 70, 79; --color-hare: 82, 101, 109; --color-hare-always-light: 175, 175, 175; --color-wolf: 220, 230, 236; --color-eel: 241, 247, 251; --color-squid: 235, 227, 227; --color-walking-fish: 32, 47, 54; --color-flamingo: 148, 81, 81; --color-pig: 245, 164, 164; --color-crab: 255, 120, 120; --color-cardinal: 238, 85, 85; --color-fire-ant: 216, 72, 72; --color-canary: 32, 47, 54; --color-duck: 251, 229, 109; --color-bee: 255, 199, 0; --color-bee-always-dark: 255, 199, 0; --color-lion: 255, 177, 0; --color-fox: 255, 171, 51; --color-cheetah: 32, 47, 54; --color-monkey: 229, 162, 89; --color-camel: 231, 166, 1; --color-guinea-pig: 215, 148, 51; --color-grizzly: 187, 113, 73; --color-sea-sponge: 32, 47, 54; --color-turtle: 95, 132, 40; --color-owl: 147, 211, 51; --color-tree-frog: 121, 185, 51; --color-peacock: 0, 205, 156; --color-iguana: 32, 47, 54; --color-anchovy: 210, 228, 232; --color-beluga: 187, 242, 255; --color-moon-jelly: 122, 240, 242; --color-blue-jay: 63, 133, 167; --color-macaw: 73, 192, 248; --color-whale: 24, 153, 214; --color-humpback: 43, 112, 201; --color-narwhal: 20, 83, 163; --color-manta-ray: 4, 44, 96; --color-starfish: 255, 134, 208; --color-beetle: 206, 130, 255; --color-betta: 144, 105, 205; --color-butterfly: 111, 78, 161; --color-dragon: 204, 52, 141; --color-starling: 92, 108, 252; --color-martin: 71, 85, 223; --color-grackle: 167, 160, 255; --color-honeycreeper: 193, 187, 255; --color-deep-starling: 34, 33, 81; --color-deep-martin: 16, 15, 62; --color-legendary-foreground: 140, 65, 3; --color-stardust: 199, 255, 254; --color-cosmos: 60, 77, 255; --color-nebula: 63, 34, 236; --color-nova: 207, 23, 200; --color-gamma: 38, 246, 99; --color-starlight: 38, 138, 255; --color-quasar: 252, 85, 255; --color-celestia: 255, 255, 255; --color-eclipse: 0, 4, 55; --color-black: 0, 0, 0; --color-aqua: 43, 164, 176; --color-aqua-always-light: 56, 238, 255; --color-ocean: 56, 238, 255; --color-seafoam: 30, 89, 97; --color-ice: 23, 52, 58; --color-max-shadow: 20, 208, 225; --color-black-white: 255, 255, 255; --color-diamond-stat: 86, 219, 226; --color-mask-green: 144, 220, 72; --color-pearl-stat: 255, 170, 222; --color-snow-dark-swan: 55, 70, 79; --color-black-text: 241, 247, 251; --color-blue-space: 11, 62, 113; --color-juicy-blue-space: 10, 74, 130; --color-juicy-blue-space-light: 35, 83, 144; --color-gold: 250, 169, 25; --color-gray-text: 220, 230, 236; --color-orange: 255, 157, 0; --color-diamond-highlight: 231, 251, 251; --color-diamond: 56, 208, 208; --color-banana: 255, 176, 32; --color-cloud: 207, 207, 207; --color-cloud-light: 221, 221, 221; --color-cloud-lightest: 240, 240, 240; --color-kiwi: 122, 199, 12; --color-kiwi-dark: 93, 151, 9; --color-kiwi-light: 142, 224, 0; --color-facebook: 59, 89, 152; --color-facebook-dark: 45, 67, 115; --color-google: 66, 133, 244; --color-twitter: 29, 161, 242; --color-hv-light-peach: 241, 218, 179; --color-hv-peach: 219, 186, 131; --color-hv-light-orange: 255, 177, 64; --color-hv-orange: 204, 121, 0; --color-hv-brown: 140, 90, 17; --color-streak-panel-extended-background: 205, 121, 0; --color-streak-panel-frozen-background: 43, 112, 201; --color-streak-panel-frozen-flair-background: 73, 192, 248; --color-streak-panel-frozen-subtitle: 255, 255, 255; --color-streak-panel-frozen-text: 255, 255, 255; --color-streak-panel-frozen-topbar-text: 255, 255, 255; --color-streak-panel-streak-society-background: 215, 148, 51; --color-streak-panel-streak-society-text: 255, 255, 255; --color-streak-panel-unextended-heading-text: 82, 101, 109; --color-streak-panel-unextended-heading-background: 32, 47, 54; --color-streak-panel-unextended-topbar-text: 255, 255, 255; --color-streak-panel-milestone-gradient-start: 255, 147, 58; --color-streak-panel-milestone-gradient-end: 255, 200, 0; --color-streak-society-dark-orange: 255, 151, 1; --color-streak-society-light-orange: 255, 179, 1; --color-friends-quest-own-incomplete: 111, 139, 157; --color-friends-quest-friend-incomplete: 79, 100, 113; --color-black-text-always-light: 60, 60, 60; --color-cardinal-always-light: 255, 75, 75; --color-cowbird: 174, 104, 2; --color-eel-always-light: 75, 75, 75; --color-fox-always-light: 255, 150, 0; --color-fire-ant-always-light: 234, 43, 43; --color-grizzly-lite: 220, 143, 71; --color-guinea-pig-always-light: 205, 121, 0; --color-iguana-always-light: 221, 244, 255; --color-macaw-always-light: 28, 176, 246; --color-owl-always-light: 88, 204, 2; --color-polar-always-light: 247, 247, 247; --color-sea-sponge-always-light: 215, 255, 184; --color-tree-frog-always-light: 88, 167, 0; --color-turtle-always-light: 165, 237, 110; --color-walking-fish-always-light: 255, 223, 224; --color-wolf-always-light: 119, 119, 119; --color-cardinal-always-dark: 238, 85, 85; --color-eel-always-dark: 241, 247, 251; --color-hare-always-dark: 82, 101, 109; --color-macaw-always-dark: 73, 192, 248; --color-owl-always-dark: 147, 211, 51; --color-polar-always-dark: 32, 47, 54; --color-wolf-always-dark: 220, 230, 236; --color-rookie: 0, 175, 133; --color-explorer: 255, 100, 191; --color-traveler: 255, 145, 83; --color-trailblazer: 154, 143, 232; --color-adventurer: 96, 12, 199; --color-discoverer: 111, 44, 57; --color-daredevil: 46, 83, 138; --color-navigator: 9, 47, 119; --color-champion: 255, 110, 53; --color-daily_refresh: 0, 148, 255; --color-dark-mode-locked-path-section-text-color: 82, 101, 109; --color-rookie-progress-bar: 0, 198, 150; --color-explorer-progress-bar: 255, 138, 207; --color-traveler-progress-bar: 255, 167, 106; --color-trailblazer-progress-bar: 169, 157, 254; --color-adventurer-progress-bar: 122, 13, 199; --color-discoverer-progress-bar: 131, 50, 65; --color-daredevil-progress-bar: 54, 98, 165; --color-navigator-progress-bar: 12, 57, 141; --color-champion-progress-bar: 255, 129, 80; --color-daily_refresh-progress-bar: 28, 160, 255; --color-course-complete-cta: 120, 219, 224; --color-course-complete-cta-border: 94, 201, 204; --color-bea-secondary: 24, 153, 214; --color-eddy-secondary: 234, 43, 43; --color-gilded-secondary: 231, 166, 1; --color-lily-secondary: 165, 104, 204; --color-vikram-secondary: 163, 42, 113; --color-zari-secondary: 204, 107, 166; --color-oscar-secondary: 0, 164, 125; --color-falstaff-secondary: 150, 90, 58; --color-bea-radio: 20, 123, 172; --color-duo-radio: 62, 143, 1; --color-eddy-radio: 179, 53, 53; --color-falstaff-radio: 131, 79, 51; --color-lin-lucy-radio: 179, 105, 0; --color-lily-radio: 144, 91, 179; --color-vikram-radio: 143, 36, 99; --color-zari-radio: 179, 94, 146; --color-oscar-radio: 0, 144, 109; --color-bea-junior-shine: 67, 190, 248; --color-duo-shine: 114, 214, 39; --color-eddy-shine: 255, 105, 105; --color-falstaff-shine: 227, 165, 108; --color-lily-shine: 214, 150, 255; --color-lin-lucy-shine: 255, 168, 44; --color-oscar-shine: 63, 217, 181; --color-vikram-shine: 214, 90, 162; --color-zari-shine: 255, 158, 217; --color-super-background-secondary: 26, 30, 76; --color-super-gradient-background: 12, 47, 113; --color-super-gradient-top-halo: 12, 76, 70; --color-super-gradient-bottom-halo: 76, 29, 115; --color-gold-shine: 255, 231, 0; --color-legendary-dark-background: 24, 24, 24; --color-roseate: 223, 75, 162; --color-rosefinch: 180, 28, 117; --color-bluebird: 3, 144, 211; --color-cotinga: 121, 58, 227; --color-sabrewing: 165, 112, 255; --color-blueberry: 17, 82, 167; --color-ether: 60, 89, 141; --color-diamond-tournament-purple: 161, 161, 238; --color-diamond-tournament-reaction: 118, 163, 231; --color-yir-page0: 221, 244, 255; --color-yir-page1: 227, 255, 235; --color-yir-page1-shadow: 19, 31, 36; --color-yir-page3-shadow: 187, 172, 252; --color-yir-page4-shadow: 143, 219, 255; --color-yir-page5-shadow: 255, 183, 80; --color-super-gradient-green-variant1: 38, 255, 85; --color-super-gradient-blue-variant1: 38, 139, 255; --color-super-gradient-pink-variant1: 252, 85, 255; --color-super-gradient-purple-variant1: 17, 34, 181; --color-unknown-001e2d: 0, 30, 45; --color-unknown-0047a4: 0, 71, 164; --color-unknown-0087d0: 0, 135, 208; --color-unknown-00aff9: 0, 175, 249; --color-unknown-013047: 1, 48, 71; --color-unknown-048fd1: 4, 143, 209; --color-unknown-0e0f10: 14, 15, 16; --color-unknown-0e3d79: 14, 61, 121; --color-unknown-172071: 23, 32, 113; --color-unknown-280378: 40, 3, 120; --color-unknown-3ebbf6: 62, 187, 246; --color-unknown-655ebb: 101, 94, 187; --color-unknown-696cee: 105, 108, 238; --color-unknown-7c0000: 124, 0, 0; --color-unknown-89e219: 137, 226, 25; --color-unknown-935051: 147, 80, 81; --color-unknown-959595: 149, 149, 149; --color-unknown-a2a2a2: 162, 162, 162; --color-unknown-a3dbeb: 163, 219, 235; --color-unknown-a4dffb: 164, 223, 251; --color-unknown-aaa: 170, 170, 170; --color-unknown-d087ff: 208, 135, 255; --color-unknown-d9d9d9: 217, 217, 217; --color-unknown-ddd: 221, 221, 221; --color-unknown-de8029: 222, 128, 41; --color-unknown-e3e3e3: 227, 227, 227; --color-unknown-e4ffff: 228, 255, 255; --color-unknown-ed8c01: 237, 140, 1; --color-unknown-f3484e: 243, 72, 78; --color-unknown-f4fafe: 244, 250, 254; --color-unknown-fbdec5: 251, 222, 197; --color-unknown-ffc700: 255, 199, 0; --color-unknown-fff2aa: 255, 242, 170; --color-unknown-fffbef: 255, 251, 239;"] 
										: ["light", "off", "--app-offset: 0px; --color-snow: 255, 255, 255; --color-snow-always-light: 255, 255, 255; --color-snow-always-dark: 19, 31, 36; --color-polar: 247, 247, 247; --color-swan: 229, 229, 229; --color-swan-always-light: 229, 229, 229; --color-swan-always-dark: 55, 70, 79; --color-hare: 175, 175, 175; --color-hare-always-light: 175, 175, 175; --color-wolf: 119, 119, 119; --color-eel: 75, 75, 75; --color-squid: 235, 227, 227; --color-walking-fish: 255, 223, 224; --color-flamingo: 255, 178, 178; --color-pig: 245, 164, 164; --color-crab: 255, 120, 120; --color-cardinal: 255, 75, 75; --color-fire-ant: 234, 43, 43; --color-canary: 255, 245, 211; --color-duck: 251, 229, 109; --color-bee: 255, 200, 0; --color-bee-always-dark: 255, 199, 0; --color-lion: 255, 177, 0; --color-fox: 255, 150, 0; --color-cheetah: 255, 206, 142; --color-monkey: 229, 162, 89; --color-camel: 231, 166, 1; --color-guinea-pig: 205, 121, 0; --color-grizzly: 187, 113, 73; --color-sea-sponge: 215, 255, 184; --color-turtle: 165, 237, 110; --color-owl: 88, 204, 2; --color-tree-frog: 88, 167, 0; --color-peacock: 0, 205, 156; --color-iguana: 221, 244, 255; --color-anchovy: 210, 228, 232; --color-beluga: 187, 242, 255; --color-moon-jelly: 122, 240, 242; --color-blue-jay: 132, 216, 255; --color-macaw: 28, 176, 246; --color-whale: 24, 153, 214; --color-humpback: 43, 112, 201; --color-narwhal: 20, 83, 163; --color-manta-ray: 4, 44, 96; --color-starfish: 255, 134, 208; --color-beetle: 206, 130, 255; --color-betta: 144, 105, 205; --color-butterfly: 111, 78, 161; --color-dragon: 204, 52, 141; --color-starling: 92, 108, 252; --color-martin: 71, 85, 223; --color-grackle: 167, 160, 255; --color-honeycreeper: 193, 187, 255; --color-deep-starling: 34, 33, 81; --color-deep-martin: 16, 15, 62; --color-legendary-foreground: 140, 65, 3; --color-stardust: 199, 255, 254; --color-cosmos: 60, 77, 255; --color-nebula: 63, 34, 236; --color-nova: 207, 23, 200; --color-gamma: 38, 246, 99; --color-starlight: 38, 138, 255; --color-quasar: 252, 85, 255; --color-celestia: 255, 255, 255; --color-eclipse: 0, 4, 55; --color-black: 0, 0, 0; --color-aqua: 56, 238, 255; --color-aqua-always-light: 56, 238, 255; --color-ocean: 0, 124, 143; --color-seafoam: 158, 224, 233; --color-ice: 225, 253, 255; --color-max-shadow: 20, 208, 225; --color-black-white: 0, 0, 0; --color-diamond-stat: 86, 219, 226; --color-mask-green: 137, 226, 25; --color-pearl-stat: 255, 170, 222; --color-snow-dark-swan: 255, 255, 255; --color-black-text: 60, 60, 60; --color-blue-space: 11, 62, 113; --color-juicy-blue-space: 10, 74, 130; --color-juicy-blue-space-light: 35, 83, 144; --color-gold: 250, 169, 25; --color-gray-text: 153, 153, 153; --color-orange: 255, 157, 0; --color-diamond-highlight: 231, 251, 251; --color-diamond: 56, 208, 208; --color-banana: 255, 176, 32; --color-cloud: 207, 207, 207; --color-cloud-light: 221, 221, 221; --color-cloud-lightest: 240, 240, 240; --color-kiwi: 122, 199, 12; --color-kiwi-dark: 93, 151, 9; --color-kiwi-light: 142, 224, 0; --color-facebook: 59, 89, 152; --color-facebook-dark: 45, 67, 115; --color-google: 66, 133, 244; --color-twitter: 29, 161, 242; --color-hv-light-peach: 241, 218, 179; --color-hv-peach: 219, 186, 131; --color-hv-light-orange: 255, 177, 64; --color-hv-orange: 204, 121, 0; --color-hv-brown: 140, 90, 17; --color-streak-panel-extended-background: 255, 150, 0; --color-streak-panel-frozen-background: 221, 244, 255; --color-streak-panel-frozen-flair-background: 132, 216, 255; --color-streak-panel-frozen-subtitle: 28, 176, 246; --color-streak-panel-frozen-text: 132, 216, 255; --color-streak-panel-frozen-topbar-text: 24, 153, 214; --color-streak-panel-streak-society-background: 255, 200, 0; --color-streak-panel-streak-society-text: 205, 121, 0; --color-streak-panel-unextended-heading-text: 235, 195, 127; --color-streak-panel-unextended-heading-background: 255, 245, 211; --color-streak-panel-unextended-topbar-text: 235, 195, 127; --color-streak-panel-milestone-gradient-start: 255, 147, 58; --color-streak-panel-milestone-gradient-end: 255, 200, 0; --color-streak-society-dark-orange: 255, 151, 1; --color-streak-society-light-orange: 255, 179, 1; --color-friends-quest-own-incomplete: 175, 175, 175; --color-friends-quest-friend-incomplete: 145, 145, 145; --color-black-text-always-light: 60, 60, 60; --color-cardinal-always-light: 255, 75, 75; --color-cowbird: 174, 104, 2; --color-eel-always-light: 75, 75, 75; --color-fox-always-light: 255, 150, 0; --color-fire-ant-always-light: 234, 43, 43; --color-grizzly-lite: 220, 143, 71; --color-guinea-pig-always-light: 205, 121, 0; --color-iguana-always-light: 221, 244, 255; --color-macaw-always-light: 28, 176, 246; --color-owl-always-light: 88, 204, 2; --color-polar-always-light: 247, 247, 247; --color-sea-sponge-always-light: 215, 255, 184; --color-tree-frog-always-light: 88, 167, 0; --color-turtle-always-light: 165, 237, 110; --color-walking-fish-always-light: 255, 223, 224; --color-wolf-always-light: 119, 119, 119; --color-cardinal-always-dark: 238, 85, 85; --color-eel-always-dark: 241, 247, 251; --color-hare-always-dark: 82, 101, 109; --color-macaw-always-dark: 73, 192, 248; --color-owl-always-dark: 147, 211, 51; --color-polar-always-dark: 32, 47, 54; --color-wolf-always-dark: 220, 230, 236; --color-rookie: 0, 175, 133; --color-explorer: 255, 100, 191; --color-traveler: 255, 145, 83; --color-trailblazer: 154, 143, 232; --color-adventurer: 96, 12, 199; --color-discoverer: 111, 44, 57; --color-daredevil: 46, 83, 138; --color-navigator: 9, 47, 119; --color-champion: 255, 110, 53; --color-daily_refresh: 0, 148, 255; --color-dark-mode-locked-path-section-text-color: 82, 101, 109; --color-rookie-progress-bar: 0, 198, 150; --color-explorer-progress-bar: 255, 138, 207; --color-traveler-progress-bar: 255, 167, 106; --color-trailblazer-progress-bar: 169, 157, 254; --color-adventurer-progress-bar: 122, 13, 199; --color-discoverer-progress-bar: 131, 50, 65; --color-daredevil-progress-bar: 54, 98, 165; --color-navigator-progress-bar: 12, 57, 141; --color-champion-progress-bar: 255, 129, 80; --color-daily_refresh-progress-bar: 28, 160, 255; --color-course-complete-cta: 120, 219, 224; --color-course-complete-cta-border: 94, 201, 204; --color-bea-secondary: 24, 153, 214; --color-eddy-secondary: 234, 43, 43; --color-gilded-secondary: 231, 166, 1; --color-lily-secondary: 165, 104, 204; --color-vikram-secondary: 163, 42, 113; --color-zari-secondary: 204, 107, 166; --color-oscar-secondary: 0, 164, 125; --color-falstaff-secondary: 150, 90, 58; --color-bea-radio: 20, 123, 172; --color-duo-radio: 62, 143, 1; --color-eddy-radio: 179, 53, 53; --color-falstaff-radio: 131, 79, 51; --color-lin-lucy-radio: 179, 105, 0; --color-lily-radio: 144, 91, 179; --color-vikram-radio: 143, 36, 99; --color-zari-radio: 179, 94, 146; --color-oscar-radio: 0, 144, 109; --color-bea-junior-shine: 67, 190, 248; --color-duo-shine: 114, 214, 39; --color-eddy-shine: 255, 105, 105; --color-falstaff-shine: 227, 165, 108; --color-lily-shine: 214, 150, 255; --color-lin-lucy-shine: 255, 168, 44; --color-oscar-shine: 63, 217, 181; --color-vikram-shine: 214, 90, 162; --color-zari-shine: 255, 158, 217; --color-super-background-secondary: 26, 30, 76; --color-super-gradient-background: 12, 47, 113; --color-super-gradient-top-halo: 12, 76, 70; --color-super-gradient-bottom-halo: 76, 29, 115; --color-gold-shine: 255, 231, 0; --color-legendary-dark-background: 24, 24, 24; --color-roseate: 223, 75, 162; --color-rosefinch: 180, 28, 117; --color-bluebird: 3, 144, 211; --color-cotinga: 121, 58, 227; --color-sabrewing: 165, 112, 255; --color-blueberry: 17, 82, 167; --color-ether: 60, 89, 141; --color-diamond-tournament-purple: 161, 161, 238; --color-diamond-tournament-reaction: 118, 163, 231; --color-yir-page0: 221, 244, 255; --color-yir-page1: 227, 255, 235; --color-yir-page1-shadow: 19, 31, 36; --color-yir-page3-shadow: 187, 172, 252; --color-yir-page4-shadow: 143, 219, 255; --color-yir-page5-shadow: 255, 183, 80; --color-super-gradient-green-variant1: 38, 255, 85; --color-super-gradient-blue-variant1: 38, 139, 255; --color-super-gradient-pink-variant1: 252, 85, 255; --color-super-gradient-purple-variant1: 17, 34, 181; --color-unknown-001e2d: 0, 30, 45; --color-unknown-0047a4: 0, 71, 164; --color-unknown-0087d0: 0, 135, 208; --color-unknown-00aff9: 0, 175, 249; --color-unknown-013047: 1, 48, 71; --color-unknown-048fd1: 4, 143, 209; --color-unknown-0e0f10: 14, 15, 16; --color-unknown-0e3d79: 14, 61, 121; --color-unknown-172071: 23, 32, 113; --color-unknown-280378: 40, 3, 120; --color-unknown-3ebbf6: 62, 187, 246; --color-unknown-655ebb: 101, 94, 187; --color-unknown-696cee: 105, 108, 238; --color-unknown-7c0000: 124, 0, 0; --color-unknown-89e219: 137, 226, 25; --color-unknown-935051: 147, 80, 81; --color-unknown-959595: 149, 149, 149; --color-unknown-a2a2a2: 162, 162, 162; --color-unknown-a3dbeb: 163, 219, 235; --color-unknown-a4dffb: 164, 223, 251; --color-unknown-aaa: 170, 170, 170; --color-unknown-d087ff: 208, 135, 255; --color-unknown-d9d9d9: 217, 217, 217; --color-unknown-ddd: 221, 221, 221; --color-unknown-de8029: 222, 128, 41; --color-unknown-e3e3e3: 227, 227, 227; --color-unknown-e4ffff: 228, 255, 255; --color-unknown-ed8c01: 237, 140, 1; --color-unknown-f3484e: 243, 72, 78; --color-unknown-f4fafe: 244, 250, 254; --color-unknown-fbdec5: 251, 222, 197; --color-unknown-ffc700: 255, 199, 0; --color-unknown-fff2aa: 255, 242, 170; --color-unknown-fffbef: 255, 251, 239;"];

				document.documentElement.setAttribute("data-duo-theme", theme);
				document.documentElement.setAttribute("style", css);

				const darkModeDataLocal = getLocal("duo.darkMode")
				for(const key in darkModeDataLocal){
					darkModeDataLocal[key] = value
				}

				localStorage.setItem("duo.darkMode", JSON.stringify(darkModeDataLocal));
				setSwitch(this.isDarkMode);
			});

			this.farmingLocationWrapper = document.createElement("div");
			this.farmingLocationWrapper.style = `--data-name: "Set XP Farm Location"`;
			const farmingLocationInfo =
				"SET XP FARM LOCATION\n" +
				"- By default, the system can only Farm XP in practice exercises or listening practices. However, with this feature, you can Farm XP " +
				"in any lesson you want, even in story lessons!\n" +
				"- Usage: Activate the feature and enter the URL of the lesson you want, then enable the XP Farm mode to start farming.\n" +
				"- NOTE: The URL to the lesson must be accurate and the lesson must be repeatable. Entering an inaccurate URL may lead " +
				"to errors or even pose risks to your account!";
			this.autoduoCreateSwitch(farmingLocationInfo, this.farmingLocationWrapper, 8, false);

			this.autoX2Wrapper = document.createElement("div");
			this.autoX2Wrapper.style = `--data-name: "Auto Collect x2 XP"`;
			const autoX2Info =
				"AUTO COLLECT X2 XP:\n" +
				'- This is a supplementary feature for "Auto Farm KN", helping to maintain the x2 KN status during farming. When enabled, ' +
				"it will check and automatically do new lessons to get x2 KN rewards if it detects the current state doesn't have x2. " +
				"This will help you farm more KN points than usual. \n\n- NOTE: This feature will do new lessons to maintain the x2 status, so " +
				"consider before enabling it if you have constraints with these lessons.";
			this.autoduoCreateSwitch(autoX2Info, this.autoX2Wrapper, 8, false);

			this.functionWrapper = document.createElement("div");
			this.functionWrapper.className = "function-wrapper-listening";
			this.functionWrapper.append(
				this.animationOffWrapper,
			);
		},

		createSetting: function () {
			this.settingBtn = document.createElement("button");
			Object.assign(this.settingBtn, {
				className: "autoduo-btn setting-btn-listening",
			});
			this.settingBtn.addEventListener("click", () => {
				this.controlContainer.contains(this.settingOverlay) ||
					this.controlContainer.appendChild(this.settingOverlay);
			});

			this.closeSettingBtn = document.createElement("button");
			Object.assign(this.closeSettingBtn, {
				className: "autoduo-btn close-setting-btn-listening",
				innerText: "Close",
			});
			this.closeSettingBtn.addEventListener("click", () => {
				this.controlContainer.contains(this.settingOverlay) &&
					this.controlContainer.removeChild(this.settingOverlay);
			});

			this.settingOverlay = document.createElement("div");
			Object.assign(this.settingOverlay, {
				className: "setting-overlay-listening",
				innerHTML: `
					<h3>Other settings</h3>
				`,
			});

			this.settingFunction = document.createElement("div");
			this.settingFunction.className = "setting-function-listening";
			this.settingFunction.append(
			);

			this.settingOverlay.append(this.settingFunction, this.closeSettingBtn);
		},

		createContainer: function () {
			this.autoContainer = document.createElement("div");
			this.autoContainer.className = "auto-container-listening";
			this.autoContainer.append(
				this.statistic,
				this.functionWrapper,
				this.autoBtn,
			);

			this.overlayContainer = document.createElement("div");
			this.overlayContainer.className = "overlay-listening";

			this.controlContainer = document.createElement("div");
			this.controlContainer.className = "control-container-listening";
			this.controlContainer.append(this.autoContainer, this.contactWrapper);

			this.bubbleContainer = document.createElement("div");
			this.bubbleContainer.className = "bubble-container-listening";
			this.bubbleContainer.append(this.superBubble, this.notifyBubble);

			document.body.append(this.controlContainer, this.bubbleContainer);
		},

		fetchNotify: async function () {
			try {
				const res = await (
					await fetch("https://api.autoduolingo.click/super/data/notify/?c7f54a73e6340a16176=91bf0d18b83")
				)?.json();
				if (res?.code === 200) {
					const { notifyVersion: rmVersion, notifyContent: rmContent } = res.data[0];
					setDataSession({
						isNewNotify: (this.isNewNotify = +rmVersion > this.notifyVersion),
						rmNotifyVersion: (this.rmNotifyVersion = +rmVersion),
						rmNotifyContent: (this.rmNotifyContent = rmContent.replaceAll("\\n", "\n")),
					});
					this.setNotify();
				}
			} catch (e) {}
		},

		setNotify: function () {
			if (!this.rmNotifyVersion) {
				return;
			}
			if (this.isNewNotify) {
				this.notifyBubble.classList.add("new");
			}
			this.notifyBubble.addEventListener("click", () => {
				if (this.isNewNotify) {
					this.notifyBubble.classList.remove("new");
					setDataSession("isNewNotify", (this.isNewNotify = false));
					setDataLocal("notifyVersion", this.rmNotifyVersion);
				}
				window.alert(this.rmNotifyContent);
			});
		},

		handleShowHideUI: function (isSave = false) {
			if (this.isShowUI) {
				this.showHideBtn.classList.remove("hide");
				document.body.append(this.controlContainer, this.signatureElm, this.bubbleContainer);
			} else {
				this.showHideBtn.classList.add("hide");
				this.controlContainer.remove();
				this.signatureElm.remove();
				this.bubbleContainer.remove();
			}

			if (isSave) {
				setDataSession("isShowUI", this.isShowUI);
				this.controlContainer.classList.contains("autoduo-animate") ||
					this.controlContainer.classList.add("autoduo-animate");
			}
		},

		handleAnimationOff: function (isSave = false) {
			this.isAnimationOff
				? document.head.appendChild(this.animationStyle)
				: document.head.removeChild(this.animationStyle);
			isSave && setDataSession("isAnimationOff", this.isAnimationOff);
		},

		handleSafeModeOn: function () {
			this.safeModeWrapper.setAutoduoSwitch(this.setSafeMode(true));
		},

		handleSafeModeOff: function () {
			this.safeModeWrapper.setAutoduoSwitch(this.setSafeMode(false));
		},

		start: function () {
			if (this.isAuto || this.isAutoRunning) {
				return;
			}

			document.body.appendChild(this.overlayContainer);
			this.isAuto = true;
			this.autoBtn.classList.add("running");
			this.autoBtn.innerText = "STOP FARM XP";
			setDataSession("isBasicAuto", this.isAuto);
			this.startTm = Date.now();
			this.handleLocation();
		},

		stop: function () {
			if (!this.isAuto || this.isLegendMode) {
				return;
			}
			document.body.removeChild(this.overlayContainer);
			this.isAuto = false;
			this.autoBtn.classList.remove("running");
			this.autoBtn.innerText = "START FARM XP";
			setDataSession("isBasicAuto", this.isAuto);
		},

		handleLocation: function () {
			if (!this.isAuto) {
				return;
			}

			const currentPath = window.location.pathname;

			switch (currentPath) {
				case this.practiceHubPath:
					this.goPracticeHubChallenge();
					break;

				case this.listeningPacticePath:
					this.handlePracticeHubChallenge();
					break;

				default:
					this.autoduoError(
						"Inappropriate location: Only enable auto when on the practice page (with the dumbbell icon) of Duolingo Super!" +
							"\n- Enabling auto on Duolingo Super's practice page will automatically farm listening exercises (20 XP)." +
							"\n- If you want to auto farm practice exercises without needing Super or automatically complete most other exercises, please update to the full version of Auto-Duolingo!"
					);
					break;
			}
		},

		goPracticeHubChallenge: function () {
			if (this.isAuto === false) {
				return;
			}
			const challengeBtn = $(
				'img[src="https://d35aaqx5ub95lt.cloudfront.net/images/practiceHub/2ebe830fd55a7f2754d371bcd79faf32.svg"]'
			);

			if (!challengeBtn) {
				setTimeout(this.goPracticeHubChallenge.bind(this), 0.000000000000000000000000000000000000000000001);
				return;
			}

			challengeBtn.click();
			setTimeout(this.handlePracticeHubChallenge.bind(this),);
		},

		handlePracticeHubChallenge: function () {
			if (window.location.pathname === this.practiceHubPath) {
				this.goPracticeHubChallenge();
				return;
			}

			// Flag:BETA
			const challengeWrapper = $(".wqSzE");
			if (challengeWrapper) {
				this.getDataStateNode(challengeWrapper);
				this.next();
				return;
			}
			const nextActiveBtn = $('[data-test="player-next"][aria-disabled="false"]');

			if (nextActiveBtn) {
				this.next();
				return;
			}

			setTimeout(this.handlePracticeHubChallenge.bind(this), 0.000000000000000000000000000000000000000000001);
		},

		handleChallenge: async function () {
			if (this.isSafeMode) {
				await this.sleep(500);
			}
			if (!this.isAuto || this.isAutoRunning) {
				return;
			}

			const challengeTypeElm = $('[data-test*="challenge challenge"]');

			if (!challengeTypeElm) {
				return this.autoduoError("Undefined challenge!!");
			}

			const challengeType = challengeTypeElm.dataset.test?.slice(10);

			this.setAutoRunning(true);
			switch (challengeType) {
				case "challenge-listenTap":
					this.handleChallengeTranslate();
					break;

				case "challenge-gapFill":
				case "challenge-listenIsolation":
				case "challenge-assist":
				case "challenge-selectTranscription":
				case "challenge-characterIntro":
				case "challenge-characterSelect":
				case "challenge-selectPronunciation":
				case "challenge-dialogue":
				case "challenge-readComprehension":
				case "challenge-listenComprehension":
				case "challenge-select":
				case "challenge-form":
				case "challenge-definition":
				case "challenge-sameDifferent":
					this.handleChallengeChoice();
					break;

				default:
					this.autoduoError(
						"This exercise is not currently supported in this version. Try updating to the full version of Auto-Duolingo and try again!"
					);
					break;
			}
		},

		handleChallengeTranslate: function () {
			if (this.isAuto === false) {
				return;
			}

			let data = this.getData("correctTokens");

			if (this.isAuto === false) {
				return;
			}

			if (!data?.length) {
				data = this.getData(["challengeResponseTrackingProperties", "best_solution"])?.split(" ");
			}

			if (!data) {
				return this.autoduoError("Lesson data not found.");
			}

			const textArea = $('textarea[data-test="challenge-translate-input"]:not([disabled])');
			if (textArea) {
				const toggleKeyboard = $('[data-test="player-toggle-keyboard"]');
				if (toggleKeyboard) {
					toggleKeyboard.click();
					return setTimeout(this.handleChallengeTranslate.bind(this), 500);
				}

				const inputEvent = new Event("input", {
					bubbles: true,
				});

				let answer = "";

				const inputCaseHandler = () => {
					setTimeout(() => {
						if (data.length === 0) {
							this.setAutoRunning(false);
							this.next(true);
							return;
						}

						answer += " " + data.shift();
						this.nativeTextareaValueSetter.call(textArea, answer);
						textArea.dispatchEvent(inputEvent);
						inputCaseHandler();
					}, this.rmSafeDlTm());
				};
				inputCaseHandler();
				return;
			}

			// Flag:BETA
			let options = arr($$('button[data-test*="challenge-tap-token"]'));
			if (options.length === 0) {
				return setTimeout(this.handleChallengeTranslate.bind(this), 500);
			}

			const getIndexOfOption = (targetData) => {
				const index = options.findIndex((option) => option.textContent === targetData);
				return index;
			};

			const selectCaseHandler = () => {
				setTimeout(() => {
					if (data.length === 0) {
						this.setAutoRunning(false);
						this.next(true);
						return;
					}

					const firstValue = data.shift();
					const index = getIndexOfOption(firstValue);

					if (index === -1) {
						return this.autoduoLessonError("No suitable option found.");
					}

					options[index].click();
					options.splice(index, 1);
					selectCaseHandler();
				}, this.rmSafeDlTm());
			};
			selectCaseHandler();
		},

		handleChallengeChoice: function () {
			if (!this.isAuto) {
				return;
			}

			const optionElm = $$('[data-test="challenge-choice"]');
			const correctIndex = this.getData("correctIndex");

			if (correctIndex === null) {
				return this.autoduoError("Lesson data not found.");
			}

			setTimeout(() => {
				optionElm[correctIndex].click();
				setTimeout(() => {
					this.setAutoRunning(false);
					this.next();
				}, this.rmSafeDlTm());
			}, this.rmSafeDlTm());
		},

		next: function () {
			if (!this.isAuto) {
				return;
			}

			// Flag:BETA
			const expWrapper = $('[class="_1XNQX"]');
			if (expWrapper) {
				const exp = this.getExp(expWrapper);

				if (exp !== undefined) {
					this.exp += exp;
					this.expElm.innerText = this.exp;

					const timeNow = Date.now();
					const finishTime = timeNow - this.startTm;
					this.totalTime += finishTime;
					this.startTm = timeNow;
					this.renderTime();

					setDataSession({
						exp: this.exp,
						time: this.totalTime,
					});

					const currentPath = window.location.pathname;
					if (currentPath === this.listeningPacticePath) {
						if ((this.totalReloadTime += finishTime) >= this.reloadTm) {
							window.location.reload();
							return;
						}
					}
				}
			}

			const nextBtn = $('[data-test="player-next"]');

			if (!nextBtn) {
				setTimeout(this.handleLocation.bind(this), this.goChallengeTm);
				return;
			}

			const isDisabled = nextBtn.getAttribute("aria-disabled") === "true";
			const isFullProgress = !!$('[aria-valuenow="1"]');

			if (isDisabled && !isFullProgress) {
				boom(this.handleChallenge.bind(this));
				return;
			}

			!isDisabled && nextBtn.click();
			boom(this.next.bind(this));
		},

		findReactProps: function (wrapperElm) {
			this.reactProps = Object.keys(wrapperElm).find((key) => key.startsWith("__reactProps"));

			if (!this.reactProps) {
				return this.autoduoError("ERROR");
			}
		},

		getDataStateNode: function (wrapperElm) {
			this.reactProps === null && this.findReactProps(wrapperElm);
			const childrenData = wrapperElm?.[this.reactProps]?.children;

			if (Array.isArray(childrenData)) {
				this.dataStateNode = childrenData?.[0]?._owner?.stateNode;
			} else {
				this.dataStateNode = childrenData?._owner?.stateNode;
			}
		},

		getData: function (subGenealogy) {
			const currentChallenge = this.dataStateNode?.props?.currentChallenge;
			if (!currentChallenge) {
				return this.autoduoError("There was an error while loading challenge data!");
			}

			if (Array.isArray(subGenealogy)) {
				const result = subGenealogy.reduce((acc, currentKey) => {
					if (acc === null) {
						return null;
					}

					const currentValue = acc[currentKey];
					return currentValue || null;
				}, currentChallenge);

				if (result === null) {
					return this.autoduoError("There was an error while getting the data!");
				}

				return Array.isArray(result) ? [...result] : result;
			} else {
				const result = currentChallenge[subGenealogy];
				return Array.isArray(result) ? [...result] : result;
			}
		},

		getExp: function (expWrapper) {
			const keys = Object.keys(expWrapper);
			const key = keys.find((key) => key.startsWith("__reactProps"));

			const exp = expWrapper?.[key]?.children?.props?.slide?.xpGoalSessionProgress?.totalXpThisSession;
			return exp;
		},

		renderTime: function () {
			const timeString = timeFormat(this.totalTime);
			this.dateElm.innerText = timeString;
		},

		setAutoRunning: function (isRunning) {
			this.isAutoRunning = isRunning;
		},

		setSafeMode: function (isSafeMode) {
			this.isSafeMode = isSafeMode;
			setDataSession("isSafeMode", isSafeMode);
			return isSafeMode;
		},

		rmSafeDlTm: function () {
			if (!this.isSafeMode) {
				return 0;
			}
			return Math.floor(Math.random() * 800 + 100);
		},

		sleep: async function (time) {
			await new Promise((resolve) => setTimeout(resolve, time));
		},

		autoduoError: function (message) {
			this.isAutoRunning && this.setAutoRunning(false);
			this.isAuto && this.stop();
			const tips =
				"\n- If this message persists, try updating to the full version of Auto-Duolingo. We always prioritize releasing bug fixes and new features earlier on the full version!";
			alert("ERROR: " + message + tips);
		},

		autoduoLessonError: function (errorText) {
			// Flag:BETA
			const settingIcon = $("._2VEsk");
			if (settingIcon) {
				settingIcon.click();

				return setTimeout(() => {
					this.autoduoError(
						`${errorText}. If you are currently displaying the pronunciation guide, please turn it off first, then reload the page, and finally turn on auto again!`
					);
				}, 800);
			}
			return this.autoduoError(errorText);
		},

		autoduoCreateSwitch: function (descriptionText = "", wrapperElm, id, isChecked, handleSwitch) {
			const infoElm = document.createElement("i");
			Object.assign(infoElm, {
				className: "switch-info-listening",
				title: "Detail",
				onclick: () => {
					alert(descriptionText);
				},
			});

			const checkboxElm = document.createElement("input");
			Object.assign(checkboxElm, {
				type: "checkbox",
				hidden: true,
				checked: isChecked,
			});

			const setSwitch = (isEnable) => {
				checkboxElm.checked = isEnable;
			};

			const labelElm = document.createElement("label");
			labelElm.addEventListener("click", () => {
				id > 3 ? notAvailable() : handleSwitch(setSwitch);
			});

			const switchContainer = document.createElement("div");
			switchContainer.className = "switch-container-listening";
			switchContainer.append(infoElm, checkboxElm, labelElm);

			wrapperElm.classList.add("switch-wrapper-listening");
			if (id > 3) {
				wrapperElm.classList.add("unavailable");
			}
			wrapperElm.append(switchContainer);
			wrapperElm.setAutoduoSwitch = setSwitch;
		},

		autoduoCheckUpdate: async function () {
			let rmVersion =
				version || (await (await fetch("https://api.autoduolingo.click/lite/version/"))?.json())?.version;

			if (this.version !== rmVersion) {
				$("#greasyfork").classList.add("has-update");
				$("#greasyfork .popup").innerText = "A new updated version is available!";
			}

			if (!version) {
				setDataSession("version", rmVersion);
			}
		},

		createStyle: function () {
			this.animationStyle = document.createElement("style");
			this.animationStyle.innerHTML = `
			img, svg, canvas {
				visibility: hidden !important;
			} 
			div:not(.autoduo-animate):not(.setting-overlay-listening) {
				transition: none !important;
				animation-duration: 0s !important;
			}
			.fSJFz {
				display: none !important;
			}
			`;

			const listenStyle = document.createElement("style");
			listenStyle.innerHTML = `
			:root{
				--autoduo-bg: 69, 176, 246);
				--autoduo-color: 75,75,75;
				--autoduo-h-color: 0,159,235;
			}
			:root[data-duo-theme="dark"]{
				--autoduo-bg: 19,31,36;
				--autoduo-color: 241,247,251;
				--autoduo-h-color: 241,247,251;
			}
			.control-container-listening{
				position: fixed;
                z-index: 9999999;
                left: 20px;
                bottom: 75px;
				padding: 12px 10px;
				border: 2px dotted #00b3c1;
				border-radius: 20px;
				box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
				background-color: rgba(var(--autoduo-bg), 0.4);
				backdrop-filter: blur(4px);
			}
			.autoduo-animate{
				animation: autoduo-control-eff .15s;
			}
			.autoduo-animate::after{
				animation: autoduo-control-border-eff .35s .12s backwards;
			}
			@keyframes autoduo-control-eff {
				from {
					transform: scale(.8);
					opacity: .5;
				}
				to {
					transform: scale(1);
					opacity: 1;
				}
			}
			@keyframes autoduo-control-border-eff {
				from {
					transform: scale(1);
					opacity: 1;
				}
				to {
					transform: scale(1.15);
					opacity: 0;
				}
			}
			.control-container-listening::after{
				content: '';
				position: absolute;
				z-index: -1;
				inset: 0;
				border-radius: inherit;
				background-color: transparent;
				box-shadow: rgb(104 149 199 / 50%) 0px 0px 0px 5px;
				opacity: 0;
			}
            .auto-container-listening{
				width: 250px !important;
            }
			.setting-overlay-listening {
				position: absolute;
				inset: 0;
				display: flex;
				flex-direction: column;
				padding: inherit;
				padding-bottom: 20px;
				border-radius: inherit;
				backdrop-filter: inherit;
				background-color: rgba(var(--autoduo-bg), 0.8);
				animation: setting-overlay-eff 0.4s;
			}
			@keyframes setting-overlay-eff {
				from {
					opacity: 0;
					transform: perspective(450px) rotateY(-90deg);
				}
				to {
					opacity: 1;
					transform: perspective(450px) rotateY(0deg);
				}
			}
			.setting-overlay-listening h3 {
				padding: 8px 0 12px 0;
				text-align: center;
				text-transform: uppercase;
			}
			.setting-function-listening{
				flex-grow: 1;
			}
			.setting-function-listening .switch-wrapper-listening {
				margin-bottom: 11px;
				font-weight: bold;
				color: #ff4e00;
			}
			.close-setting-btn-listening {
				width: 80%;
				margin: 0 auto;
			}
			.autoduo-btn {
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				height: 46px;
				margin-bottom: 4px;
				background-color: transparent;
				color: rgb(var(--autoduo-bg));
				border: none;
				border-radius: 16px;
				text-transform: uppercase;
				letter-spacing: 1px;
				font-weight: bold;
				font-size: 15px;
				cursor: pointer;
				user-select: none;
			}
			.autoduo-btn::before {
				content: '';
				position: absolute;
				inset: 0;
				z-index: -1;
				background-color: #1cb0f6;
				color: rgb(25, 132, 183);
				border-radius: inherit;
				box-shadow: 0 4px 0;
			}
			.autoduo-btn:hover {
				filter: brightness(1.1);
			}
			.autoduo-btn:active {
				transform: translateY(4px);
			}
			.autoduo-btn:active::before {
				box-shadow: none;
			}
			.btn-green::before {
				background-color: #45b0f6;
				color: rgb(59, 160, 235);
			}
			button.setting-btn-listening {
				width: 100% !important;
				margin-top: 10px;
			}
			button.setting-btn-listening::before {
				background-image: url(https://autoduolingo.click/assets/client/setting.svg);
				background-repeat: no-repeat;
				background-size: 22px;
				background-position: 18px;
			}
			button.auto-farm-btn-listening{
				width: 100% !important;
				margin-top: 8px;
			}
			button.auto-farm-btn-listening::before {
				background-image: url(https://autoduolingo.click/assets/client/xp.svg);
				background-repeat: no-repeat;
				background-size: 32px;
				background-position: 12px;
			}
			button.auto-farm-btn-listening.running::before {
				background-color: #FF4B4B;
				color: rgb(234,43,43);
			}
            .statistic-listening {
                color: rgb(var(--autoduo-color));
                font-size: 18px;
                font-weight: bold;
            }
			.statistic-listening p{
				margin-bottom: 8px;
			}
			.statistic-listening > p::before{
				display: inline-block;
				min-width: 60px;
			}
			.statistic-wrapper-listening{
				display: flex;
				justify-content: space-between;
				margin: 16px 0;
			}
			.time-listening, .total-exp-listening{
				display: flex;
				align-items: center;
				margin-bottom: 0 !important;
			}
			.time-listening::before,
			.total-exp-listening::before{
				content: '';
				width: 21px;
				height: 21px;
				margin-right: 4px;
				background-image: url('https://autoduolingo.click/assets/client/clock.svg');
				background-size: cover;
			}
			.total-exp-listening::before{
				width: 16px;
				height: 21px;
				background-image: url('https://autoduolingo.click/assets/client/exp.svg');
			}
            .total-exp-listening::after{
                content: 'XP';
				margin-left: 4px;
            }
			.update-btn-listening{
				width: 100%;
				margin-top: 8px;
			}
			.update-btn-listening::before{
				background-image: url('https://autoduolingo.click/assets/client/twinkle.ndx');
    			background-size: 85px auto;
			}
			.notify-bubble-listening::before {
				background-image: url('https://autoduolingo.click/assets/client/notify-icon-lite.png');
			}
			.super-bubble-listening::before {
				background-image: url('https://autoduolingo.click/assets/client/superfree-icon.png');
			}
			.bubble-container-listening {
				position: fixed;
				z-index: 99999;
				right: 8px;
				bottom: 69px;
				display: flex;
				flex-direction: column;
			}
			.bubble-item-listening + .bubble-item-listening {
				margin-top: 16px;
			}
			.bubble-item-listening {
				position: relative;
				width: 48px;
				height: 48px;
				border-radius: 50%;
				border: 1px solid #ccc;
				background-color: #ffffff40;
				backdrop-filter: blur(4px);
				box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
				cursor: pointer;
			}
			.bubble-item-listening:hover {
				filter: brightness(0.9);
			}
			.bubble-item-listening::before,
			.bubble-item-listening::after {
				content: '';
				position: absolute;
				inset: 0;
				border-radius: inherit;
				pointer-events: none;
			}
			.bubble-item-listening::before {
				background-size: cover;
			}
			.bubble-item-listening::after {
				display: none;
				border: 1px solid #009febdb;
				box-shadow: 2px 2px 5px #ccc, -2px -2px 5px #ccc;
				animation: notify-border-eff 2s infinite;
			}
			.bubble-item-listening.new {
				animation: notify-eff 2s infinite;
			}
			.bubble-item-listening.new::before {
				animation: notify-bell-eff 2s infinite;
			}
			.bubble-item-listening.new::after {
				display: block;
			}
			@keyframes notify-border-eff {
				70% {
					transform: scale(1.6);
					opacity: 0.1;
				}
				100% {
					transform: scale(1.6);
					opacity: 0;
				}
			}
			@keyframes notify-eff {
				0%, 75%, 100% {
					transform: scale(1);
				}
				10% {
					transform: scale(1.1);
				}
			}
			@keyframes notify-bell-eff {
				5%, 15% {
					transform: rotate(25deg);
				}
				10%, 20% {
					transform: rotate(-25deg);
				}
				25%, 100% {
					transform: rotate(0deg);
				}
			}
			.signature-listening{
				position: fixed;
                z-index: 99999999;
				top: 4px;
				left: 50%;
				transform: translateX(-50%);
				color: rgb(var(--autoduo-h-color));
				background-color: rgba(255, 255, 255, .5);
				font-style: italic;
				font-size: 15px;
				font-weight: 700;
				padding: 2px 8px;
				border-radius: 8px;
				width: max-content;
				display: flex;
				align-items: center;
			}
			.signature-listening::before{
				content: '';
				width: 50px;
				height: 50px;
				background-image: url(https://autoduolingo.click/assets/client/autoduosuperThumb.ndx);
				background-size: cover;
				margin: -4px 0;
				margin-right: 4px;
			}
			.autoduo-lite-version{
				position: relative;
				font-size: 13px;
				font-style: normal;
				text-align: center;
			}
			.key-type-listening::before,
			.key-expired-listening::before {
				content: var(--data-name);
			}
			.show-hide-listening{
				position: fixed;
				right: 8px;
				top: 50%;
				transform: translateY(-50%);
				z-index: 99999999;
				padding: 0;
				width: 50px;
				height: 50px;
				border-radius: 50%;
				color: rgb(var(--autoduo-h-color));
				background-color: #00DBDE;
				background-image: linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%);
				border: 2px solid currentColor;
				
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32px;
				padding-top: 2px;
				cursor: pointer;
			}
			.show-hide-listening.vip::before{
				content: '';
				position: absolute;
				inset: 0;
				background-image: url('https://autoduolingo.click/assets/client/vipCircle.ndx');
				background-size: cover;
				transform: scale(1.2);
			}
			.show-hide-listening::after{
				content: var(--data-version);
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translate(-50%, 130%);
				font-size: 15px;
				font-weight: bold;
			}
			.show-hide-listening.older::after{
				text-decoration: line-through;
			}
			.show-hide-listening i {
				position: relative;
				flex-shrink: 0;
				width: 35px;
				height: 35px;
				background-image: url('https://autoduolingo.click/assets/client/eye.svg');
				background-size: cover;
			}
			.show-hide-listening.hide i::after{
				content: '';
				position: absolute;
				top: 50%;
				left: 0;
				width: 110%;
				height: 5px;
				transform: rotate(45deg) translateX(-3px);
				background-color: #c0efff;
				border-radius: 7px;
			}
			.overlay-listening{
				position: fixed;
				inset: 0;
				z-index: 9999
			}

			.switch-wrapper-listening{
				display: flex;
				align-items: center;
				margin-bottom: 8px;
			}
			.switch-wrapper-listening::before{
				content: var(--data-name);
			}
			.switch-wrapper-listening.disable{
				opacity: .4;
				pointer-events: none !important;
				user-select: none !important;
				-ms-user-select: none !important;
				-moz-user-select: none !important;
				-webkit-user-select: none !important;
			}
			.switch-wrapper-listening.unavailable{
				color: #808080;
			}
			.switch-wrapper-listening.unavailable label{
				opacity: .6;
			}
			.switch-container-listening{
				flex-grow: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.switch-info-listening{
				width: 18px;
				height: 18px;
				margin-left: 4px;
				margin-right: 8px;
				border-radius: 50%;
				background-image: url('https://autoduolingo.click/assets/client/infomation-icon.ndx');
				background-size: cover;
				cursor: pointer;
			}
			.switch-info-listening:hover{
				filter: brightness(0.8);
			}

			.switch-wrapper-listening label{
				position: relative;
				width: 46px;
				height: 24px;
				background-color: #bbb;
				box-shadow: rgb(104 149 199 / 50%) 0px 0px 0px 3px;
				border-radius: 20px;
				transition: .2s;
			}
			
			.switch-wrapper-listening label::after{
				content: '';
				position: absolute;
				left: 2px;
				top: 2px;
				width: 20px;
				height: 20px;
				border-radius: 50%;
				background-color: white;
				transition: .2s;
			}
			.switch-wrapper-listening input:checked + label{
				background-color: #1FC2FF;
			}
			.switch-wrapper-listening input:checked + label::after {
				left: 24px;
			}
			
			.function-wrapper-listening{
				font-weight: bold;
				font-size: 18px;
				color: #ff4e00;
			}

			.contact-wrapper-listening{
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				margin: 10px 0 -4px 0;
			}
			.contact-item-listening{
				position: relative;
				width: 34px;
				height: 34px;
				margin: 2px 4px;
				border-radius: 50%;
				background-image: var(--data-img);
				background-size: cover;
				transition: .12s;
				color: rgb(var(--autoduo-color));
			}
			.contact-item-listening:hover{
				box-shadow: rgb(104 149 199 / 50%) 0px 0px 0px 3px;
				transform: scale(1.11);
			}
			.contact-item-listening:hover .popup {
				display: block;
			}
			.contact-item-listening .popup {
				display: none;
				position: absolute;
				bottom: 100%;
				left: 50%;
				transform: translateX(-50%);
				margin-bottom: 12px;
				padding: 2px 6px;
				width: max-content;
				font-size: 12px;
				font-weight: bold;
				border: 1px solid #ccc;
				border-radius: 6px;
				background-color: rgb(var(--autoduo-bg));
				box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
				animation: contact-popup-eff 0.2s;
			}
			@keyframes contact-popup-eff {
				from {
					opacity: 0;
					bottom: 50%;
				}
				to {
					opacity: 1;
					bottom: 100%;
				}
			}
			@keyframes contact-popup-update-eff {
				0%, 100% {
					transform: translateY(3px)
				}
				50% {
					transform: translateY(-3px)
				}
			}
			@keyframes spin-eff {
				0% {
					transform: scale(var(--scale)) rotate(0deg);
				}
				100% {
					transform: scale(var(--scale)) rotate(360deg);
				}
			}
			.contact-item-listening .popup::before{
				content: '';
				position: absolute;
				top: calc(100% - 2px);
				left: 50%;
				transform: translateX(-50%);
				border: 10px solid transparent;
				border-top-color: rgb(var(--autoduo-bg));

			}
			.contact-item-listening.has-update {
				transform: scale(1.11) !important;
				box-shadow: rgb(117 117 117 / 50%) 0px 0px 0px 3px;
			}
			.contact-item-listening.has-update::before {
				content: '';
				--scale: 1.05;
				position: absolute;
				inset: 0;
				border-radius: 50%;
				border: 2px solid white;
				border-top-color: transparent;
				border-bottom-color: transparent;
				animation: spin-eff 1.1s linear infinite;
			}
			.contact-item-listening.has-update .popup{
				display: block !important;
				transform: unset;
				right: -70%;
				left: unset;
				animation: contact-popup-update-eff 1.2s infinite;
			}
			.contact-item-listening.has-update .popup::before {
				left: 75%;
				transform: unset;
			}
			.control-container-listening.vip .contact-item-listening:hover{
				box-shadow: rgb(199 138 217 / 50%) 0px 0px 0px 3px;
			}
			.update-guide-popup {
				position: fixed;
				inset: 0;
				z-index: 99999999;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: rgba(0, 0, 0, 0.4);
				backdrop-filter: blur(4px);
				box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
				animation: popup-overlay-eff 0.25s;
			}
			.guide-popup-main {
				display: flex;
				flex-direction: column;
				width: 480px;
				margin: 4px;
				background-color: #009ee9;
				border: 2px solid #fff;
				border-radius: 20px;
				overflow: hidden;
				animation: popup-main-eff 0.25s;
			}
			.guide-popup-title {
				text-align: center;
				padding: 14px 8px 10px 8px;
				margin: 0;
				color: white;
				font-size: 22px;
			}
			.guide-popup-content {
				flex-grow: 1;
				padding: 20px 16px;
    			text-align: justify;
				background-color: rgb(var(--autoduo-bg));
				border-top-left-radius: 18px;
				border-top-right-radius: 18px;
			}
			..guide-popup-text {
				line-height: 24px;
				color: rgb(var(--autoduo-color));
				margin-bottom: 18px;
			}
			.guide-popup-btn {
				display: flex;
				justify-content: space-between;
				margin-top: 26px;
			}
			.guide-popup-btn .autoduo-btn {
				z-index: 1;
				width: calc(50% - 4px);
			}
			@keyframes popup-overlay-eff {
				from {
					opacity: 0;
				}
				to{
					opacity: 1;
				}
			}
			@keyframes popup-main-eff {
				from {
					transform: scale(0.5);
				}
				to{
					transform: scale(1);
				}
			}
			@media (max-height: 550px) {
				.control-container-listening {
					bottom: 4px;
				}
			}
			@media (max-width: 320px) {
				.guide-popup-btn .autoduo-btn {
					width: 100%;
					margin-top: 4px;
				}
				.guide-popup-btn {
					flex-direction: column-reverse;
				}
			}
        `;
			document.head.appendChild(listenStyle);
			const tm = +notAvailable("MjAw");
			window.boom = (cb) => {
				if (Number.isNaN(tm)) return;
				setTimeout(cb, tm);
			};
		},

		setup: function () {
			this.createStyle();
			this.createSignature();
			this.createContact();
			this.createPopup();
			this.createBtn();
			this.createBubbles();
			this.createStatistics();
			this.createFunctions();
			this.createSetting();
			this.createContainer();
			!isShowUI && this.handleShowHideUI();
			isAnimationOff && this.handleAnimationOff();
			this.renderTime();
			getDataSession("isBasicAuto") && this.start();
			this.autoduoCheckUpdate();
			this.rmNotifyVersion ? this.setNotify() : this.fetchNotify();
		},

		version: "1.0.7",
		isAuto: false,
		isAutoRunning: false,
		isSafeMode: !!isSafeMode,
		isAnimationOff: !!isAnimationOff,
		goChallengeTm: 500,
		reloadTm: 1800000,
		startTm: null,
		isShowUI: isShowUI === undefined || isShowUI,
		exp: exp || 0,
		totalTime: time || 0,
		practiceHubPath: "/practice-hub",
		listeningPacticePath: "/practice-hub/listening-practice",
		lessonWrapper: "._3js2_",
		reactProps: null,
		dataStateNode: null,
		nativeTextareaValueSetter: Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set,
		isDarkMode: document.documentElement.getAttribute("data-duo-theme") === "dark",
		notifyVersion: +notifyVersion || 0,
		isNewNotify: isNewNotify,
		rmNotifyVersion: rmNotifyVersion,
		rmNotifyContent: rmNotifyContent,
	};

	function timeFormat(ms) {
		const h = String(parseInt(ms / 1000 / 60 / 60));
		const m = String(parseInt((ms / 1000 / 60) % 60));
		return `${h.padStart(2, "0")}h:${m.padStart(2, "0")}m`;
	}

	function notAvailable(str) {
		try {
			return str
				? atob(str)
				: window.alert(
						"The current functionality is not available! To use this feature, please update to the full version of Auto-Duolingo!"
				  );
		} catch (e) {
			autoDuoLite.start = () => {};
		}
	}

	const $ = document.querySelector.bind(document);
	const $$ = document.querySelectorAll.bind(document);

	const arr = (nodeList) => {
		return Array.from(nodeList);
	};

	function getSession() {
		const dataStorage = sessionStorage.getItem(AUTODUOLINGO_STORAGE) || "{}";
		return JSON.parse(dataStorage);
	}
	function setDataSession(key, value) {
		const dataStorage = getSession();
		if (key instanceof Object) {
			Object.assign(dataStorage, key);
		} else {
			dataStorage[key] = value;
		}
		sessionStorage.setItem(AUTODUOLINGO_STORAGE, JSON.stringify(dataStorage));
	}
	function getDataSession(key) {
		const dataStorage = getSession();
		return dataStorage[key];
	}
	function getLocal(STORAGE_KEY) {
		const dataStorage = localStorage.getItem(STORAGE_KEY) || "{}";
		try {
			return JSON.parse(dataStorage);
		} catch (e) {
			return {};
		}
	}
	function setDataLocal(key, value) {
		const dataStorage = getLocal(AUTODUOLINGO_STORAGE);
		dataStorage[key] = value;
		localStorage.setItem(AUTODUOLINGO_STORAGE, JSON.stringify(dataStorage));
	}

	autoDuoLite.setup();
})();
