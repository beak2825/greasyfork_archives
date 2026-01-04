// ==UserScript==
// @name         WaniKani Mnemonic Artwork
// @namespace    mnemonicartwork
// @version      7.24
// @description  Adds the artwork by AmandaBear to radical and kanji mnemonics (currently for level 1-7).
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1673042
// @homepageURL  https://community.wanikani.com/t/47656
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418774/WaniKani%20Mnemonic%20Artwork.user.js
// @updateURL https://update.greasyfork.org/scripts/418774/WaniKani%20Mnemonic%20Artwork.meta.js
// ==/UserScript==

(function() {
	"use strict";
	/* global $, wkItemInfo */
	/* eslint no-multi-spaces: "off" */

	//////////////
	// settings //
	//////////////

	const ENABLE_RESIZE_BY_DRAGGING = true;

	//////////////

	function init() {
		wkItemInfo.forType("radical,kanji").under("meaning,reading").append("Mnemonic Artwork", ({id}) => artworkSection(id));
	}

	function artworkSection(subjectId) {
		let artworkUrl = ARTWORK_URLS[subjectId];
		if (!artworkUrl) return null;

		let image = document.createElement("img");
		image.src = artworkUrl;
		if (ENABLE_RESIZE_BY_DRAGGING) {
			let currentMax = parseInt(localStorage.getItem("mnemonicArtworkMaxSize")) || 900;
			makeMaxResizable(image, currentMax).afterResize(m => { localStorage.setItem("mnemonicArtworkMaxSize", m); let e = new Event("storage"); e.key = "mnemonicArtworkMaxSize"; e.newValue = m; dispatchEvent(e); });
			addEventListener("storage", e => { if (e.key === "mnemonicArtworkMaxSize") { image.style.maxWidth = `min(${e.newValue}px, 100%)`; image.style.maxHeight = e.newValue + "px"; } });
		}
		return image;
	}

	function makeMaxResizable(element, currentMax, lowerBound = 200) {
		let size      = 0;
		let max       = currentMax;
		let oldMax    = currentMax;
		let callback  = () => {};
		let pointers  = [{id: NaN, x: 0, y: 0}]; // image origin is always a pointer (scaling center)

		function getDistanceSum(e) {
			removePointer(e);
			addPointer(e);
			function length(p1, p2) { let d = [p1.x - p2.x, p1.y - p2.y]; return Math.sqrt(d[0] * d[0] + d[1] * d[1]); }
			return pointers.reduce((total, p1) => pointers.reduce((l, p2) => l + length(p1, p2), total), 0);
			//return pointers.reduce(([len, lastP], p) => [len + length(lastP, p), p], [0, pointers[pointers.length - 1]])[0]; // old version using circumference - order dependent! => not usable if pointers.length > 3
		};
		function removePointer(e) {
			if (e) pointers = pointers.filter(p => p.id !== e.pointerId);
		}
		function addPointer(e) {
			if (!e) return;
			let rect = element.getBoundingClientRect();
			pointers.push({id: e.pointerId, x: e.clientX - rect.left, y: e.clientY - rect.top});
		}
		function startResizing(e) {
			if (e.button !== 0) return;

			if (pointers.length < 2) {
				max    = parseFloat(element.style.maxHeight);
				oldMax = max;
			}

			size = getDistanceSum(e);
			element.addEventListener("pointermove", doResizing);
			element.addEventListener("pointerup", endResizing);
			element.addEventListener("pointercancel", cancelResizing);
			element.setPointerCapture(e.pointerId);
			e.preventDefault();
		}
		function doResizing(e) {
			if (!(e.buttons & 1)) return;

			let newSize = getDistanceSum(e);
			max *= newSize / size;
			size = newSize;
			updateMax();
		};
		function endResizing(e) {
			doResizing(e);
			max = Math.min(max, element.parentElement.clientWidth, element.naturalWidth);
			oldMax = Math.max(max, lowerBound);
			cancelResizing(e);
			callback(max);
		}
		function cancelResizing(e) {
			removePointer(e);
			size = getDistanceSum();
			if (pointers.length > 1) return;

			max = oldMax;
			updateMax();
			element.removeEventListener("pointermove", doResizing);
			element.removeEventListener("pointerup", endResizing);
			element.removeEventListener("pointercancel", cancelResizing);
			element.releasePointerCapture(e.pointerId);
		}
		function updateMax() {
			let m = Math.max(max, lowerBound);
			element.style.maxWidth  = `min(${m}px, 100%)`;
			element.style.maxHeight = m + "px";
		};
		updateMax();
		element.style.touchAction = "pan-x pan-y";
		element.addEventListener("pointerdown", startResizing);

		return {afterResize: f => { callback = f; }};
	}

	const COMMON_URL = "https://global.discourse-cdn.com/wanikanicommunity/original/4X/";
	const ARTWORK_URLS = {
		   6: `${COMMON_URL}5/6/f/56f448502c1e93a871d9c6c47bb1f9a23950b531.png`, // Barb                      (radical)
		  18: `${COMMON_URL}b/9/8/b984c8ab44ddcd5cdcd8e8fc15aa973911ff569b.png`, // Big                       (radical)
		  25: `${COMMON_URL}a/0/8/a081cdec15282359700fba695c6c0850d458248f.png`, // Construction              (radical)
		  15: `${COMMON_URL}c/c/6/cc657d8404a3baa45854345a18dc4fe2d787c512.png`, // Cross                     (radical)
		   3: `${COMMON_URL}6/f/9/6f91d6d4592bc600a88385e8b330513913cd3d47.png`, // Drop                      (radical)
		  12: `${COMMON_URL}e/8/c/e8ce6b98ac411788cad76e5995f7a34dffe5f4d9.png`, // Enter                     (radical)
		   2: `${COMMON_URL}2/e/f/2ef7e71d4ec80aa260ee2168e3dcaab83b994593.png`, // Fins                      (radical)
		   1: `${COMMON_URL}f/7/c/f7c5838e7e5e582075b94aba316118a153f94d0a.png`, // Ground                    (radical)
		8762: `${COMMON_URL}e/b/a/eba4638e5098178a5c0b7326ccd1504b8851ce63.png`, // Gun                       (radical)
		8763: `${COMMON_URL}6/b/8/6b81813b3a7039e3207119e02870831b1cf6b65e.png`, // Leaf                      (radical)
		   8: `${COMMON_URL}c/2/6/c26694a2bda280820fe8bbdd8c89b573e653a19e.png`, // Lid                       (radical)
		  20: `${COMMON_URL}2/c/9/2c9404b8417de56a3f3b3012457e5ec296a6baa4.png`, // Mountain                  (radical)
		  16: `${COMMON_URL}7/8/8/78868fc2d54c6a50e195ce3f5a4809dcb038f311.png`, // Mouth                     (radical)
		  11: `${COMMON_URL}a/6/5/a65144d4b621b88d8ee81df44868b7ef70e7e99f.png`, // Nine                      (radical)
		   9: `${COMMON_URL}8/8/6/88603f8339be21c092c7881c88a59d4e83d40e4d.png`, // Person                    (radical)
		  13: `${COMMON_URL}0/3/7/0375e1c89ea0fcc327acd09711b899982abe8734.png`, // Power                     (radical)
		  14: `${COMMON_URL}d/b/2/db25671770b35117bb8909478f748cc1062821ff.png`, // Prison                    (radical)
		  21: `${COMMON_URL}6/e/3/6e3ec179483673d11176fea9c4081147af4948ae.png`, // River                     (radical)
		   4: `${COMMON_URL}8/6/c/86c1d5ad6624a2d53ee51d06ff7ad6ca15828b38.png`, // Seven                     (radical)
		   5: `${COMMON_URL}d/9/a/d9a081dfd719221d039ffa3b77c2cbef0a0c8899.png`, // Slide                     (radical)
		8761: `${COMMON_URL}7/7/e/77ebda51d9b263aaba242e8f6229dd71c0f80fe9.png`, // Stick                     (radical)
		  22: `${COMMON_URL}2/d/4/2d489d13e8255d2af7b973cb1f126287ade74a50.png`, // Sun                       (radical)
		  10: `${COMMON_URL}a/5/d/a5dd26c7f6d6e43775cfd4fc66a6a91c2f9740a0.png`, // Toe                       (radical)
		  23: `${COMMON_URL}9/3/9/939e85bb1b68099b37ea00eeb45444db61b84cd3.png`, // Tree                      (radical)
		   7: `${COMMON_URL}b/4/c/b4cc56fab72f173b5c90db044f781d00c8665a1a.png`, // Two                       (radical)
		  19: `${COMMON_URL}d/3/a/d3a5b4025b98f0b848b0285049bf72195644aa8d.png`, // Woman                     (radical)
		 450: `${COMMON_URL}e/c/4/ec4ddbe69d57915996d1063f0632effec115965c.png`, // Above                     (kanji)
		 451: `${COMMON_URL}d/d/b/ddb17c8ad86dd6b25b05537f7c326f427f013a6a.png`, // Below                     (kanji)
		 453: `${COMMON_URL}3/7/5/3756fff2fea8803f2bfb966b7deec5cfd344b8a5.png`, // Big                       (kanji)
		 457: `${COMMON_URL}e/d/e/edea580d713baab6ddade6c956e7a461163b6e3d.png`, // Construction              (kanji)
		 446: `${COMMON_URL}0/e/e/0ee47a26b1d11dcae4bcb3b13c0d2ed9e8fdc2e9.png`, // Eight                     (kanji)
		 445: `${COMMON_URL}b/c/2/bc27093006486634e38255ef93f0c8cbea82a49d.png`, // Enter                     (kanji)
		 455: `${COMMON_URL}b/8/2/b82fce1d6af88f72b3360b533052eb6961fb0f50.png`, // Mountain                  (kanji)
		 452: `${COMMON_URL}6/6/d/66da9fceb553885477b3ad87f5fa5d997f37f98c.png`, // Mouth                     (kanji)
		 442: `${COMMON_URL}a/7/3/a736d25f2d6d1b4d93902b8f8dbe14a4dbbbedbd.png`, // Nine                      (kanji)
		 440: `${COMMON_URL}6/4/8/648c0ce43bfeaa9b22e59d3181e4ab3915801169.png`, // One                       (kanji)
		 444: `${COMMON_URL}7/6/5/765b4a9e4534b084b1c4e4b5b7b2a8b48cc2315f.png`, // Person                    (kanji)
		 447: `${COMMON_URL}6/f/5/6f50b05bc1abac5a37a4b5d062090015fb8d2737.png`, // Power                     (kanji)
		 456: `${COMMON_URL}c/5/f/c5f4ac0a9b6612d437eba203069bd72fdc94265d.png`, // River                     (kanji)
		 443: `${COMMON_URL}8/7/6/876daae66ceaf20e55c7dfec25f2d3d54a894736.png`, // Seven                     (kanji)
		 448: `${COMMON_URL}6/8/5/68529ef8d15a8dc92137347592e577ad9bb1cc7f.png`, // Ten                       (kanji)
		 449: `${COMMON_URL}1/8/e/18e84975e89ce693126441504cd854a4ac19f972.png`, // Three                     (kanji)
		 441: `${COMMON_URL}0/8/a/08a50f427c412951a4166eed16ddd994e20cf0f2.png`, // Two                       (kanji)
		 454: `${COMMON_URL}c/1/c/c1cd697e343f87cf7141cc84e07a654dd7cbe696.png`, // Woman                     (kanji)
		  50: `${COMMON_URL}f/5/0/f507bc41565cdddfa261f205d358a5623b244cac.png`, // Book                      (radical)
		  36: `${COMMON_URL}1/4/7/147bb291fc71a6cf1c12ba544ccf73d37186c49f.png`, // Bow                       (radical)
		  34: `${COMMON_URL}8/f/2/8f2a7514b66a961076a6ccbbd5d148ac581b0287.png`, // Child                     (radical)
		 126: `${COMMON_URL}1/1/f/11f5a899e941931aa79ff26dfb690d8cf0ef171c.png`, // Cow                       (radical)
		  17: `${COMMON_URL}c/4/b/c4b06ceb6ed7289661ff41ac3f452548b4852fb0.png`, // Dirt                      (radical)
		  47: `${COMMON_URL}2/5/f/25fe81a8bb231b9a0d5596f9b9ae71ac567ede7d.png`, // Dog                       (radical)
		  33: `${COMMON_URL}d/3/0/d303e5c62cb84b0d04221e8235eefe3e692f37b3.png`, // Evening                   (radical)
		  53: `${COMMON_URL}c/a/d/cad904d8128694028d9896535c59e57f71b06905.png`, // Eye                       (radical)
		  46: `${COMMON_URL}6/7/6/6764f897baf8fb3c5fbcbc6af846ae379f556ec3.png`, // Fire                      (radical)
		  39: `${COMMON_URL}d/9/4/d94b343ddf3ed46a0fcbea7851b6f93aa6fce623.png`, // Five                      (radical)
		  37: `${COMMON_URL}a/8/6/a863b4f05d8e10b1e001f5bf92d5c4c59ffb80dc.png`, // Flag                      (radical)
		  38: `${COMMON_URL}7/6/2/762b504defc7dbedb3c945a6e1365c765f22a42f.png`, // Hair                      (radical)
		  41: `${COMMON_URL}7/0/b/70bc45bef7723a989ac75e2ea5e0fa55f153f844.png`, // Hand                      (radical)
		  29: `${COMMON_URL}d/c/3/dc3e5139f3a85003cb0b2e0cfc5cddaec2efcaaf.png`, // Head                      (radical)
		  40: `${COMMON_URL}b/2/c/b2ced0619f8a7907172c232c7f1061b4dd72d9ef.png`, // Heaven                    (radical)
		  48: `${COMMON_URL}0/d/0/0d0e64e23ab2eaaa7aaf20e120fe034ab74211d7.png`, // King                      (radical)
		  28: `${COMMON_URL}c/7/8/c784c02ba1858c8443760230ecdb89d0643356bd.png`, // Legs                      (radical)
		  49: `${COMMON_URL}1/0/6/10692b149a69f50c882f5c6beb884dee8e1af908.png`, // Middle                    (radical)
		  43: `${COMMON_URL}5/f/a/5fae5121da1b12a9224fe8410619e02b1a9f1e4b.png`, // Moon                      (radical)
		  26: `${COMMON_URL}a/8/6/a86ba460546c75e96bb2a52e61f5e3a9bd169297.png`, // Narwhal                   (radical)
		 140: `${COMMON_URL}1/0/3/1037e043c736579d46008a722c1d253e61b048f4.png`, // Private                   (radical)
		  51: `${COMMON_URL}5/d/3/5d3c46c4845fdd33737151dc028c619e3092c6fc.png`, // Rice Paddy                (radical)
		  35: `${COMMON_URL}1/b/5/1b557f6fe4f60f60fce36c910539a2cfce88fe67.png`, // Small                     (radical)
		  55: `${COMMON_URL}8/3/c/83c40ea997af261c5db1bb932f9d6b06fca02524.png`, // Stand                     (radical)
		  54: `${COMMON_URL}0/1/9/0194d7613eaea08a7e17a221f8455079fdbd0d57.png`, // Stone                     (radical)
		  30: `${COMMON_URL}2/a/c/2ac2599531bde883b56ef0e647b215832c66ceea.png`, // Stool                     (radical)
		  44: `${COMMON_URL}4/b/c/4bc564e4a5796d424a625690a8f0acd726632db1.png`, // Stop                      (radical)
		  27: `${COMMON_URL}c/2/7/c27df67a2eb212f8c9b822d5a2fbd12da6972f97.png`, // Street                    (radical)
		  24: `${COMMON_URL}3/0/7/30793bcf80e8b6111d9ca8455a20e211c27dfb7b.png`, // Sword                     (radical)
		  32: `${COMMON_URL}0/9/6/096b28482e6ff0faf7316d30ecc41af4848268ea.png`, // Thousand                  (radical)
		  31: `${COMMON_URL}c/6/9/c690f15d9730f18a5dfd3a1eb8bd70d4eaac69df.png`, // Treasure                  (radical)
		  45: `${COMMON_URL}c/d/e/cde99478687beb9cb89ac2f6001adc6429d5955f.png`, // Water                     (radical)
		  52: `${COMMON_URL}8/6/b/86bf0749b564382fa2b2d9d08998ae7dace67928.png`, // White                     (radical)
		  42: `${COMMON_URL}6/e/4/6e4db0ca07a0e8d37a4c23c4db036ad6bc8ae519.png`, // Writing                   (radical)
		 466: `${COMMON_URL}a/4/3/a43c7d1a83faae3c2cf1d7edfdf0e961adfbdffc.png`, // Again                     (kanji)
		 489: `${COMMON_URL}2/a/9/2a92e058146f87aa8cdadebc69a62d2f4527264d.png`, // Ball                      (kanji)
		 487: `${COMMON_URL}a/5/2/a52981f0762dd5b73e4422442096f1c0f32cd6f4.png`, // Book                      (kanji)
		 462: `${COMMON_URL}7/4/0/740842306d70ba092bebdbb7bc9aa897e7ea66e3.png`, // Child                     (kanji)
		 467: `${COMMON_URL}8/e/e/8ee1e4711ff8abc0d756b74f17421adc6f0cc16e.png`, // Circle                    (kanji)
		 488: `${COMMON_URL}9/6/f/96f4542992c78cd7c526aa36136d823b072bd14b.png`, // Correct                   (kanji)
		 459: `${COMMON_URL}4/e/b/4eb607c0adc7eeb6c34c803598d0bfde6d26a74b.png`, // Dirt                      (kanji)
		 481: `${COMMON_URL}7/e/b/7eb3bd2d9ce04ddd8faabcc0bf36bdb2c8e58453.png`, // Dog                       (kanji)
		 461: `${COMMON_URL}d/c/3/dc386573343e49686e175b64c5520be699a0952b.png`, // Evening                   (kanji)
		 483: `${COMMON_URL}4/0/8/4086e9feaa5efb63a37fc4aa4e15f1544f618406.png`, // Exit                      (kanji)
		 492: `${COMMON_URL}6/a/d/6ad999f0a311c8b8422c2f55054410d5b3909a3d.png`, // Eye                       (kanji)
		 465: `${COMMON_URL}4/3/5/4359d4403e9a131dc4f8e53870b874fc38377524.png`, // Finish                    (kanji)
		 480: `${COMMON_URL}8/0/a/80ab28c7bc358792bea5e6be968cddee1ad7fa95.png`, // Fire                      (kanji)
		 470: `${COMMON_URL}1/8/b/18bb5230b3ca3ee8e4ed3d8f211d43bf6f0177cf.png`, // Five                      (kanji)
		 485: `${COMMON_URL}7/1/5/715997145a0d8734234196d19a52b56cd25d2730.png`, // Four                      (kanji)
		 468: `${COMMON_URL}6/a/3/6a3d5a037f545bc10f2dc6aeda96ad5997864abe.png`, // Genius                    (kanji)
		 474: `${COMMON_URL}9/0/c/90ca0ee459debea88ea3b5dd50f7e6246b9df040.png`, // Hand                      (kanji)
		 473: `${COMMON_URL}5/7/1/571ee157f7c0d6e7cefd2e0b6e7e1a5a3dd6bf44.png`, // Heaven                    (kanji)
		 482: `${COMMON_URL}0/e/a/0eaf6444060ba1c1c4d498698ad863ff410e75d5.png`, // King                      (kanji)
		 486: `${COMMON_URL}5/5/c/55cfc4db04e9f38fad30959196be4c2c0c6ff3f1.png`, // Left                      (kanji)
		 469: `${COMMON_URL}f/4/b/f4b24e675854934740f9a925918b53302462ffe1.png`, // Middle                    (kanji)
		 477: `${COMMON_URL}3/a/b/3abff51692c7f78e54c2a5a1ee0d8ad3f0a810fd.png`, // Moon                      (kanji)
		 856: `${COMMON_URL}d/c/b/dcb35ca512c302159c27edd6203a1dc6e5f363ba.png`, // Repeater                  (kanji)
		 490: `${COMMON_URL}6/f/e/6feaf51fe85653d3f784555e19201bb51c69cab0.png`, // Rice Paddy                (kanji)
		 484: `${COMMON_URL}8/7/2/8729aa34a0834858fe12106192405bfa0e8b6052.png`, // Right                     (kanji)
		 471: `${COMMON_URL}0/9/1/091d86577e2312aa22a132979e8a6245bd811f5b.png`, // Six                       (kanji)
		 463: `${COMMON_URL}b/f/9/bf927183f3a725518df39d0b933ac2b3aca1b704.png`, // Small                     (kanji)
		 494: `${COMMON_URL}5/a/7/5a7bbbee0840f887b0edea00b6a86ca806efc5af.png`, // Stand                     (kanji)
		 464: `${COMMON_URL}e/f/4/ef4cb9b88ea8932290ccb2a43c9d4bfd0e18bcf1.png`, // Street                    (kanji)
		 476: `${COMMON_URL}a/0/c/a0c707ccfe3766ef3db449f67837f8447963c125.png`, // Sun                       (kanji)
		 458: `${COMMON_URL}9/f/7/9f7d83144238b11f8a37b15534e00a247b16612e.png`, // Sword                     (kanji)
		 460: `${COMMON_URL}c/e/d/ced2c4e02dfa9d0e32fd892ffcd5cf3ee1017b0d.png`, // Thousand                  (kanji)
		 478: `${COMMON_URL}9/7/e/97e71200683e2e97cf08182bb44e28c5efd198f1.png`, // Tree                      (kanji)
		 479: `${COMMON_URL}5/9/1/5916b5cbeffe1d85a1be73335a49454b9ae45d3a.png`, // Water                     (kanji)
		 491: `${COMMON_URL}5/0/d/50dfb10e74418bc104bc3a0d9a4e4f27c2abee13.png`, // White                     (kanji)
		 475: `${COMMON_URL}c/1/6/c16fc0f6875074d9af1d8fc7f3bb5dc1ad1af855.png`, // Writing                   (kanji)
		 472: `${COMMON_URL}7/6/0/7601080b57624625866d100e4bdd8413439b0640.png`, // Yen                       (kanji)
		  72: `${COMMON_URL}5/6/8/5687d7bfb138f08d5c5a2617531ebd76df5fabca.png`, // Arrow                     (radical)
		  62: `${COMMON_URL}a/5/7/a579b02f9186af87c8ba09ba5974aa24180dba26.png`, // Canopy                    (radical)
		  66: `${COMMON_URL}a/3/c/a3c0f74aac7d2602b52d06a5e5a96b66f7a69bfd.png`, // Direction                 (radical)
		  73: `${COMMON_URL}b/f/5/bf53f58f596bdc6e81c4b79a2a651d0f551e48a2.png`, // Door                      (radical)
		  61: `${COMMON_URL}6/d/6/6d6fae796ea99dc4938a541c6f73e9d15e744875.png`, // Dry                       (radical)
		  68: `${COMMON_URL}d/1/f/d1f1f7c1043a3e924fff1f92f04014872b0cfc44.png`, // Father                    (radical)
		  63: `${COMMON_URL}d/e/8/de8eae964fff0d71f74a1042da4812da7b3b437c.png`, // Fingers                   (radical)
		  67: `${COMMON_URL}e/d/7/ed74ca4045ef4619490787200ca23574ed45a7cf.png`, // Fur                       (radical)
		8764: `${COMMON_URL}c/4/5/c45f7c4b8247302d8215204a5e0bbd48a0a6cd67.png`, // Hat                       (radical)
		  65: `${COMMON_URL}b/8/c/b8c48b5f09f0fac4189ffe28cfabd639a2cf7cdd.png`, // Heart                     (radical)
		 210: `${COMMON_URL}5/e/b/5eb07323e3182f37fea922d03a23e36017933c28.png`, // Life                      (radical)
		 238: `${COMMON_URL}4/b/2/4b27354b1fe25ff4ee81571fd576a916abebee97.png`, // Now                       (radical)
		  69: `${COMMON_URL}e/3/e/e3eefc7a21992189d9350a3d6408d4ec57678498.png`, // Old                       (radical)
		  64: `${COMMON_URL}6/a/e/6aeeab4fdddea16d86d926f86ac3bcd86f15f262.png`, // Origin                    (radical)
		  87: `${COMMON_URL}5/f/6/5f660c463639a45965bceebfa9f1a709ccfce018.png`, // Poop                      (radical)
		  57: `${COMMON_URL}0/a/c/0acbc095ee5e5f039d4b9a3d0fb33e6279b3ff8d.png`, // Spoon                     (radical)
		  71: `${COMMON_URL}b/3/a/b3a8794c9a87a48e21404b94c41953d3236a9496.png`, // Task                      (radical)
		 102: `${COMMON_URL}7/8/0/7808885ac14eca842f300d4d2b6b292e286d0d70.png`, // Towel                     (radical)
		8765: `${COMMON_URL}2/a/e/2aece8258875a331af0db2fdddc87559a08bd5fc.png`, // Triceratops               (radical)
		  60: `${COMMON_URL}2/0/2/20274a9d221d7f070b7f47eb931c26efa5ecfc2c.png`, // Winter                    (radical)
		 526: `${COMMON_URL}a/9/4/a9481b2323d3d4d2609e07b6e823bc99b6ed9f5f.png`, // Arrow                     (kanji)
		 522: `${COMMON_URL}1/f/7/1f761f4164d19c6aca5ac9dc3a685dd4e620ee02.png`, // City                      (kanji)
		 511: `${COMMON_URL}b/2/d/b2d998bb4602002738e4474f2b31e3178907bb2a.png`, // Cow                       (kanji)
		 502: `${COMMON_URL}b/7/2/b72872729c9e973f8f702c9c9069028b76bd2bc7.png`, // Cut                       (kanji)
		 510: `${COMMON_URL}c/b/4/cb4f9773890b28f56435c4ba6cf2d2557456b7d1.png`, // Direction                 (kanji)
		 509: `${COMMON_URL}d/e/2/de28e4ceee5474aaa35694e5e61944836e5c2a5b.png`, // Door                      (kanji)
		 505: `${COMMON_URL}1/c/b/1cb4ee871feb1511dab3cef180fc5e83b0c4321d.png`, // Fat                       (kanji)
		 512: `${COMMON_URL}c/e/f/cef808a7597cb0d6804d8b7c65a12359a1e6d7ce.png`, // Father                    (kanji)
		 506: `${COMMON_URL}0/7/1/071408aa692785f6cb5a5aad887b22e950081e50.png`, // Few                       (kanji)
		 504: `${COMMON_URL}c/3/6/c36b5e0f8ec2bb8d2aa10c672020e08151684a17.png`, // Friend                    (kanji)
		 513: `${COMMON_URL}c/0/f/c0faf9356a98577fff3efc8257d336d42c12ccf0.png`, // Fur                       (kanji)
		 518: `${COMMON_URL}4/6/b/46b58e63fbd9711c77fd2451790d9b8e7d1f07fc.png`, // Half                      (kanji)
		 508: `${COMMON_URL}0/6/7/067885e68e1ae83ba01a97ee5d02ca5132d9c435.png`, // Heart                     (kanji)
		 500: `${COMMON_URL}4/6/2/4628df8433107598f896c7af5bbe4a9934dd895c.png`, // Inside                    (kanji)
		 850: `${COMMON_URL}3/4/5/34547e5fef4d3960c4aa9d88b2da52f63c1171fe.png`, // Life                      (kanji)
		 520: `${COMMON_URL}2/d/f/2df5efa4fb7cbf100506f0a609ef7df5029b7c7a.png`, // Machine                   (kanji)
		 524: `${COMMON_URL}5/a/9/5a99110d6cb59d277dd74f6e434d3e0b9c575648.png`, // Mother                    (kanji)
		 503: `${COMMON_URL}6/1/5/61525454e15337055ed644572dbc2d8025ab2378.png`, // Noon                      (kanji)
		 517: `${COMMON_URL}a/d/2/ad2a6cc918928f884de8c4f6797d4211a4ce0def.png`, // North                     (kanji)
		 497: `${COMMON_URL}4/a/3/4a39b5f282a1e66adfad69836f1fa03b0a4130c6.png`, // Now                       (kanji)
		 519: `${COMMON_URL}2/f/3/2f3f7f27448c943fca8dbf973adc7d955c4c7506.png`, // Old                       (kanji)
		 498: `${COMMON_URL}7/2/a/72a0410fcd65e6af61cc2d84f75fb22578af075a.png`, // Origin                    (kanji)
		 521: `${COMMON_URL}9/f/9/9f99669e963e4f6da22c5891876bcd95fe1b9bb4.png`, // Outside                   (kanji)
		 501: `${COMMON_URL}4/8/b/48b3f1a0dcd59c7e45b79edbd291fab13afb4787.png`, // Part                      (kanji)
		 499: `${COMMON_URL}3/0/e/30e9ad6b2d1c4b50f154e14aa70487db2a310acc.png`, // Public                    (kanji)
		 507: `${COMMON_URL}d/e/0/de0c69896fa17858292ca7d4df80683b24a9e792.png`, // Pull                      (kanji)
		 514: `${COMMON_URL}7/1/4/71434dac9813f40d77c2597dc715ad8c29efea96.png`, // Stop                      (kanji)
		 525: `${COMMON_URL}1/2/3/123cd2a40f52392d06d1a5caa18cdb4c2a574618.png`, // Task                      (kanji)
		 495: `${COMMON_URL}7/3/6/736a7785978289283a464c8b3028c2b58dc9e716.png`, // Ten Thousand              (kanji)
		 523: `${COMMON_URL}1/c/8/1c893a84345077def7d28d13f76cb6ea9b9fe9be.png`, // Wide                      (kanji)
		 516: `${COMMON_URL}6/e/9/6e96e4dae99e87c9f4882846929845b0aabb2902.png`, // Winter                    (kanji)
		  77: `${COMMON_URL}d/b/f/dbf0f2b5227126907fafce0c597436149808c255.png`, // Alligator                 (radical)
		  85: `${COMMON_URL}9/3/5/9357f182764a8f68d216d7fb1b995dc9329d4d0f.png`, // Bamboo                    (radical)
		 100: `${COMMON_URL}0/e/6/0e623d2eacf7bf352e78111dbdbf213541cd7fe4.png`, // Bed                       (radical)
		8766: `${COMMON_URL}b/3/7/b37fddb0a9b83878f8c3317d89e5a51ed2fcaf24.png`, // Beggar                    (radical)
		  81: `${COMMON_URL}5/d/4/5d416f16efd7bc2a9ad46464ec6ed04e04e84bb5.png`, // Branch                    (radical)
		  93: `${COMMON_URL}5/c/4/5c4a9cfca21eddacf252a2c8704c968f84ffe332.png`, // Car                       (radical)
		  79: `${COMMON_URL}a/a/9/aa9368da1f868c67cd3023de49135b0f331c19f4.png`, // Ceremony                  (radical)
		 116: `${COMMON_URL}a/5/4/a54ead9028809511beb9c5bafc0127644ff98a6e.png`, // Cliff                     (radical)
		  88: `${COMMON_URL}7/c/9/7c9e71cb6a5e1b3b8f4619e98bc7146c9b0c985b.png`, // Ear                       (radical)
		  82: `${COMMON_URL}8/1/d/81dbebd32a8aba9943e6123d5d03ffad3999e39c.png`, // Energy                    (radical)
		  90: `${COMMON_URL}e/e/6/ee668c4ec68d7285f6edf775408ad11f9ea60890.png`, // Flowers                   (radical)
		  95: `${COMMON_URL}4/7/e/47e70a25d7976944a6bc601b895c6379028e691d.png`, // Foot                      (radical)
		  76: `${COMMON_URL}a/b/b/abb2c63de3a3081085ca7ccc22d9aef57e963088.png`, // Forehead                  (radical)
		8767: `${COMMON_URL}2/0/7/2073bc9e4983bff306e41516c19441a6b1245cc7.png`, // Horns                     (radical)
		  89: `${COMMON_URL}3/f/0/3f06f42a7e904d82b7beafcd97fd7fe795ee71f0.png`, // Insect                    (radical)
		  75: `${COMMON_URL}4/7/9/479e8af4729ff9c8eab4dae6f2d11335a5307888.png`, // Leader                    (radical)
		  99: `${COMMON_URL}b/8/5/b85122f8cde250e28608f88920e8e27c7ba235dc.png`, // Loiter                    (radical)
		 154: `${COMMON_URL}f/f/6/ff6d6989fa25a9962cb7547aaaa562cf7119304c.png`, // Master                    (radical)
		  74: `${COMMON_URL}7/0/c/70c749fe3ac7e2ca89968f31ad4b20f7bf76269e.png`, // Measurement               (radical)
		  96: `${COMMON_URL}d/f/2/df28dfb44101336d1a10835854f3e9c582ed934c.png`, // Not                       (radical)
		 101: `${COMMON_URL}9/d/3/9d3c6095a126510334e8b4e1732295b0998ba904.png`, // Pi                        (radical)
		  84: `${COMMON_URL}4/7/a/47af92bb3d23b041f6c34792373a6efbf0b41ca3.png`, // Plate                     (radical)
		  92: `${COMMON_URL}0/6/0/060c17372fe82ee22224d063edcfab44bdac5be0.png`, // Red                       (radical)
		  98: `${COMMON_URL}a/a/c/aacac74d3a2eae6321e4a96eae154edc45f9a677.png`, // Rice                      (radical)
		  78: `${COMMON_URL}8/7/c/87c1fe042eaf14665d3b335ee8621a513d820c7d.png`, // Roof                      (radical)
		  97: `${COMMON_URL}d/d/5/dd57a115076e6632dc80d584543e2d8882aadc72.png`, // Samurai                   (radical)
		  91: `${COMMON_URL}0/b/5/0b59a2a4fa897765913954a23f190e45e9a06d30.png`, // See                       (radical)
		  94: `${COMMON_URL}5/d/d/5dd0ee0d98daa9bef87c4ee32893bfdc893087ac.png`, // Shellfish                 (radical)
		8768: `${COMMON_URL}8/e/5/8e5bedf8f261f768938e0fb3d01b629023f7d273.png`, // Spikes                    (radical)
		  80: `${COMMON_URL}3/7/e/37e67bcae4cddd20219f86af7c1514145fee3814.png`, // Spirit                    (radical)
		  86: `${COMMON_URL}b/8/2/b8253f8c843ff050c7c3d57c05832da38a50a9f3.png`, // Thread                    (radical)
		 211: `${COMMON_URL}a/5/9/a59a52eac41596dac5649fed78a21a4ceffd5388.png`, // Umbrella                  (radical)
		  83: `${COMMON_URL}a/3/f/a3f9c2b14142b4ff96b363e8d1c48aac66c7ba22.png`, // World                     (radical)
		 550: `${COMMON_URL}b/5/6/b56760a5b26b6b9b1ed125cd2bc2e27465c320bd.png`, // Bamboo                    (kanji)
		 562: `${COMMON_URL}2/f/4/2f4b26e2cc7d5c27af6d1cb1e9824e39e89dd9bb.png`, // Car                       (kanji)
		 534: `${COMMON_URL}e/4/7/e4759ec1d28d34f60863be30494c7bd76b9c8d1c.png`, // Center                    (kanji)
		 531: `${COMMON_URL}9/1/6/916285792d110b718170720ecbb6b88c14766ea4.png`, // Copy                      (kanji)
		 564: `${COMMON_URL}1/2/7/12729856be191f3d60c3796bcf2b5b8ec68c9b40.png`, // Doing                     (kanji)
		 552: `${COMMON_URL}1/2/d/12dd8b4115a1fbc88e5c0b05b9dcbca19527cf40.png`, // Ear                       (kanji)
		 547: `${COMMON_URL}3/3/1/331ed5b1622c89866a6edd1bcc79e6dbc1dd09b8.png`, // Early                     (kanji)
		 548: `${COMMON_URL}b/c/4/bc481288dbd8b4076f65cd24c0b8a1a468162cc8.png`, // Energy                    (kanji)
		 535: `${COMMON_URL}f/7/a/f7ad58ad4a341448c10a69f96203de0446434369.png`, // Flat                      (kanji)
		 557: `${COMMON_URL}1/9/c/19c440483b06c2c090f17d80e44f6563baf63b83.png`, // Flower                    (kanji)
		 561: `${COMMON_URL}9/f/b/9fb37bcf5f1f2878196382f3788693af89a0c1af.png`, // Foot                      (kanji)
		 536: `${COMMON_URL}d/6/2/d62a25c57672db032366286a67fe116d4dac3dfd.png`, // Hit                       (kanji)
		 549: `${COMMON_URL}c/9/8/c98bc998b202f24a44520cf0d3653c9e2bd22ee3.png`, // Hundred                   (kanji)
		 537: `${COMMON_URL}b/1/9/b19fb366d320a8a906035494762cb4657a32eab1.png`, // Ice                       (kanji)
		 553: `${COMMON_URL}1/6/c/16c7afcec62b73bfa04e00bc00ff8c0386a945dc.png`, // Insect                    (kanji)
		 545: `${COMMON_URL}7/e/1/7e1d8265dd5e4188d27b5e5eefbaa15222672406.png`, // Letter                    (kanji)
		 555: `${COMMON_URL}e/8/2/e827f15f0b59c12947f9c5911e27ea3ef2785482.png`, // Man                       (kanji)
		 528: `${COMMON_URL}5/7/a/57ac5cf5ab7d2f6a04d3130fc53a92ad5fe8e724.png`, // Master                    (kanji)
		 544: `${COMMON_URL}1/9/3/1930678d567656e7b502702d1e2923a56996d941.png`, // Name                      (kanji)
		 563: `${COMMON_URL}b/9/9/b99b1a5c1d7ed8dfffd8c6f801d32de28a6aa9af.png`, // Not                       (kanji)
		 533: `${COMMON_URL}4/0/5/4053ab96acb715ec1cdcf37cfce0e102c78d8c33.png`, // Number                    (kanji)
		 529: `${COMMON_URL}5/7/1/5718ea76af3b5425839ff92037a3e0206d42c5d6.png`, // Other                     (kanji)
		 532: `${COMMON_URL}7/e/2/7e25e025974f6ea795b899f59ffe6e4afcddd675.png`, // Past                      (kanji)
		 540: `${COMMON_URL}5/3/3/533ff55b20524c27623cf64ef04e08d9c6323236.png`, // Plate                     (kanji)
		 543: `${COMMON_URL}8/6/7/8672ebed984246c5e42e29e5cdaf9936ea0d9ab4.png`, // Previous                  (kanji)
		 560: `${COMMON_URL}0/5/4/05495c9840ef954f7ea3977ecb2dbb3ffcecd9f8.png`, // Red                       (kanji)
		 542: `${COMMON_URL}d/c/e/dceee7c1d201faf47f8e652d4c01af3eee6c9457.png`, // Rest                      (kanji)
		 538: `${COMMON_URL}5/1/8/518c376e82b60d48f0f9a74902f85c87757375aa.png`, // Say Humbly                (kanji)
		 558: `${COMMON_URL}8/d/d/8dd3486619b7ee0c8c2021bcbee6c93695d4d7a0.png`, // See                       (kanji)
		 559: `${COMMON_URL}e/b/7/eb7a56ec1d75e604951070be24d3b36f7285326b.png`, // Shellfish                 (kanji)
		 493: `${COMMON_URL}1/2/6/126cf41a62ec84b49ff3431c035863e76c87fcf1.png`, // Stone                     (kanji)
		 530: `${COMMON_URL}b/b/7/bb742c89d510e1377fea20ded3fbbb227a8ddeea.png`, // Substitute                (kanji)
		 541: `${COMMON_URL}b/7/f/b7f95ac345b4889a37fd83f5f17f022bf476475a.png`, // Thanks                    (kanji)
		 551: `${COMMON_URL}e/1/6/e16dac9465d831af7ed926174219f2ca98847f70.png`, // Thread                    (kanji)
		 556: `${COMMON_URL}a/5/3/a5394abade266403f719ea7576abdcf636f91c3b.png`, // Town                      (kanji)
		1520: `${COMMON_URL}f/2/f/f2fa704cfcd51f2f2c878a4eb1e51f1e54b4e3d6.png`, // Treasure                  (kanji)
		 554: `${COMMON_URL}a/5/d/a5d35441e87e7f882dbc071249025f410abfe8dd.png`, // Village                   (kanji)
		 527: `${COMMON_URL}b/2/c/b2c024affef8192bf7119a3aa7c871c1825e54d8.png`, // World                     (kanji)
		 546: `${COMMON_URL}e/e/7/ee7fbb022966c89fb70e765815cf3b3b1a9d6b6a.png`, // Year                      (kanji)
		 115: `${COMMON_URL}e/b/c/ebc6ab044cf2aa62a410f58fa8692dae52381fb3.png`, // Axe                       (radical)
		 120: `${COMMON_URL}7/9/b/79bb0ec603513ba08be38e0166f00ab7b22cfa3a.png`, // Blue                      (radical)
		 104: `${COMMON_URL}e/1/6/e16f9f6284ae4afe5ac300b21fc633b4e1a99dff.png`, // Coffin                    (radical)
		 110: `${COMMON_URL}2/d/4/2d452247d6135c42c216d13f5e82e144ad8d6de4.png`, // Color                     (radical)
		 213: `${COMMON_URL}0/4/9/0491c33f2d60733ff9b1b06fadbf5a603069fe4d.png`, // Feathers                  (radical)
		 111: `${COMMON_URL}3/6/1/3619ebc595626077da434883bf5e48e3a93ded01.png`, // Go                        (radical)
		 118: `${COMMON_URL}e/0/f/e0f487ebf099582ac5aa0ccb946743984e6a188a.png`, // Gold                      (radical)
		 123: `${COMMON_URL}1/c/4/1c44a49d9fcd1b417a9bb80e6a155103dae4b357.png`, // Ice                       (radical)
		 122: `${COMMON_URL}2/e/c/2ecfdac03fd312c31c6f23cd7b2314b30202f848.png`, // Key                       (radical)
		8770: `${COMMON_URL}2/c/2/2c23a7392eebde1a0f6dc86bf8c9a147759632da.png`, // Kick                      (radical)
		 171: `${COMMON_URL}8/f/0/8f01ffa650962e2a6293239fd1d4d83615ff51ae.png`, // Lantern                   (radical)
		 113: `${COMMON_URL}b/7/9/b793493e61841b863377b722bae1b2a744cc425c.png`, // Lip Ring                  (radical)
		 108: `${COMMON_URL}c/c/5/cc52484009211c018a999affe9e6af8d04f088bc.png`, // Meat                      (radical)
		 155: `${COMMON_URL}2/e/f/2ef42a6368c7b0fe83fe894c847a77e30d9e01c2.png`, // Meet                      (radical)
		 121: `${COMMON_URL}e/8/3/e836e56e104c34a8d303e5965538aa52e691a630.png`, // Mustache                  (radical)
		 119: `${COMMON_URL}4/a/9/4a93f4e7fff40cb7f8720549a2a6a75bd191066d.png`, // Rain                      (radical)
		 124: `${COMMON_URL}f/b/7/fb79bc9359dbad970a6eec691f5bcffdf8313a3b.png`, // Run                       (radical)
		 117: `${COMMON_URL}5/2/9/52948f6d582fe3ff5aa3ccfb25cbad688b3fa491.png`, // Say                       (radical)
		 114: `${COMMON_URL}5/e/2/5e2309382ced1cd63c9c9838089ad245ea84e5ba.png`, // Scooter                   (radical)
		 109: `${COMMON_URL}1/6/5/16506fef3e57ca2dd01ecdc086d18e5e34a015e3.png`, // Self                      (radical)
		 103: `${COMMON_URL}9/5/5/9551685aa122bcaf70375db9f12e89ba9bb3404b.png`, // Tsunami                   (radical)
		 106: `${COMMON_URL}7/5/3/753eb6f5f6f61298b573b3aec084387b851e55d5.png`, // Twenty                    (radical)
		8769: `${COMMON_URL}e/6/d/e6d5e01c7f0b6f0bb8e483e81fff8b506c53aeab.png`, // Viking                    (radical)
		 125: `${COMMON_URL}c/9/c/c9c8594fe6518a5d7cac46218ca491afe54a3d83.png`, // Village                   (radical)
		 112: `${COMMON_URL}f/1/3/f134f319f6b5a04cbc7c04a788261c7a8fdeccdf.png`, // West                      (radical)
		 107: `${COMMON_URL}d/b/7/db7eb6225a9325440f77fc382e918f7d43626ecb.png`, // Window                    (radical)
		 105: `${COMMON_URL}2/b/4/2b4f575c1e48ee5482ea9b737f205f333645a25a.png`, // Wolverine                 (radical)
		 592: `${COMMON_URL}7/e/9/7e94c3cf16cd5577a2b15d83a2909fd180188630.png`, // Angle                     (kanji)
		8884: `${COMMON_URL}3/a/7/3a72e8dd2b33fa1b43c4bdab5348f4fe3284706e.png`, // Axe                       (kanji)
		 604: `${COMMON_URL}1/8/8/188ab0fa203e1e4e98bcfe845010aa6fae2d9afc.png`, // Blue                      (kanji)
		 583: `${COMMON_URL}a/f/a/afaad2c17456f384de939057a24cf191da305be0.png`, // Body                      (kanji)
		 579: `${COMMON_URL}3/1/9/31944d331e222b3c9c4918ec7cc31ddaeb97d9df.png`, // Color                     (kanji)
		 590: `${COMMON_URL}5/b/0/5b03bfc5cc069d3d4bd9a5ae3b31ddaaa11e8922.png`, // Come                      (kanji)
		 591: `${COMMON_URL}5/2/a/52aa861dfd5318c1b1e6680e3a1e233f09feb984.png`, // Company                   (kanji)
		 571: `${COMMON_URL}2/6/5/265516063f7c6bad8f8d9272728fb3b22435c5c8.png`, // Correct                   (kanji)
		 585: `${COMMON_URL}4/2/a/42ac596549fe4fd76786f84be99fe788c2f47988.png`, // Diagram                   (kanji)
		 572: `${COMMON_URL}0/f/4/0f4af29762ef84356a9e8944c8953b9653304c4e.png`, // Every                     (kanji)
		 575: `${COMMON_URL}5/4/3/543142bc47c03716b72cf9dd01bb08fd0e9b2e49.png`, // Feather                   (kanji)
		 600: `${COMMON_URL}6/e/d/6ed80d56bca4a43eae0bd370d21cba5c94076b05.png`, // Forest                    (kanji)
		 580: `${COMMON_URL}d/0/1/d018fcb6aa297d9082941cfc775042bd424d0caa.png`, // Go                        (kanji)
		 602: `${COMMON_URL}e/b/4/eb4cb92401deb5b5379b172f9ae4fca6c9ef37e6.png`, // Gold                      (kanji)
		 605: `${COMMON_URL}9/8/a/98a2e5dec213d44d254ebc9048214c9ff722d002.png`, // Grass                     (kanji)
		 597: `${COMMON_URL}a/9/8/a98434ea273238e604e1ed53a451ab17dfbf59c7.png`, // Hometown                  (kanji)
		 584: `${COMMON_URL}4/1/1/41154cc47b28a05e1a2dc09f7f547b83d279e224.png`, // Make                      (kanji)
		 570: `${COMMON_URL}c/d/0/cd0d5e41a2b5e3a88f8a5db1155767b812955b58.png`, // Many                      (kanji)
		 577: `${COMMON_URL}5/0/3/5033531e2241d97a47da4757ce775f26789f4ac3.png`, // Meat                      (kanji)
		 566: `${COMMON_URL}c/7/e/c7eed43d7a6852bc22a17271892a80f9a1482029.png`, // Meet                      (kanji)
		 565: `${COMMON_URL}0/f/7/0f7cb394f886a022fe5d245ac90cc61b0a0c1709.png`, // Mix                       (kanji)
		 596: `${COMMON_URL}b/9/b/b9b7a549543564be972380b34935224dced189d3.png`, // Near                      (kanji)
		 515: `${COMMON_URL}a/9/8/a981c67034c3a6df9e72448b972c22daf4737446.png`, // Older Brother             (kanji)
		 603: `${COMMON_URL}1/e/1/1e15232fdcd51ee5389219b22da8da18ccd26433.png`, // Rain                      (kanji)
		 574: `${COMMON_URL}d/3/b/d3b040c98141d52df8e7fe34f284d1b797a6c692.png`, // Rice                      (kanji)
		 595: `${COMMON_URL}7/6/9/76954ffd77edd900116b4f458a1a64724cef14db.png`, // Run                       (kanji)
		 568: `${COMMON_URL}6/a/a/6aa0e6db65a64459b68859610bf65043d9be35a6.png`, // Same                      (kanji)
		 593: `${COMMON_URL}0/c/2/0c2ff4d55ef2f0cef7ada32b3763ef8b12591502.png`, // Say                       (kanji)
		 578: `${COMMON_URL}6/f/9/6f9f46077cf1ff19d29c0c5c8e8097d42ee9f430.png`, // Self                      (kanji)
		 589: `${COMMON_URL}c/b/b/cbb8e7c8f8e6df56de6e27af5ee84c5307376012.png`, // Shape                     (kanji)
		 539: `${COMMON_URL}c/c/a/cca351bca31a5634cae707726d86306676272e96.png`, // Skin                      (kanji)
		 601: `${COMMON_URL}6/1/1/6114300ff369eb28c67f5a11ff90bb4a476c3189.png`, // Sky                       (kanji)
		 606: `${COMMON_URL}8/0/4/8044ae54c5bd03d48a651f2f755d48ba1f8b4abc.png`, // Sound                     (kanji)
		 599: `${COMMON_URL}b/d/e/bde082a888eee5261219e685a44433f986df0fc3.png`, // Study                     (kanji)
		 567: `${COMMON_URL}e/c/9/ec9d268e3db2a6d8c05e39d168b1b08c9c55f9c0.png`, // Sunlight                  (kanji)
		 576: `${COMMON_URL}2/a/7/2a7f66f76f9ffff660974dec90c1ea8bc5595a79.png`, // Think                     (kanji)
		 569: `${COMMON_URL}3/9/2/392fff14e5de5ac71c2a6396f5f0e1582f69df1f.png`, // Times                     (kanji)
		 594: `${COMMON_URL}6/1/1/61187e800316e770ea01b009c9ec5061844c39e6.png`, // Valley                    (kanji)
		 586: `${COMMON_URL}3/2/3/3239ea7950a393ccfb196a9641f52733ae4fcee5.png`, // Voice                     (kanji)
		 581: `${COMMON_URL}6/d/0/6d0cc07fd346e2514bdb9671c64ec188ac33cb66.png`, // West                      (kanji)
		 582: `${COMMON_URL}3/5/a/35a79ecba88cd795ee327d9418f7c9998b927c52.png`, // What                      (kanji)
		 598: `${COMMON_URL}b/9/4/b942f101d66a299111b8ac2717b949c1f1b912d7.png`, // Wheat                     (kanji)
		 588: `${COMMON_URL}d/6/7/d67d9c9b95faab02e01e999b78df484c740e170f.png`, // Younger Brother           (kanji)
		 130: `${COMMON_URL}c/8/b/c8b84c6738c9fcca9630b33db25bfbc26a25887b.png`, // Angel                     (radical)
		 144: `${COMMON_URL}b/d/7/bd794382914fb5dcec7fa7f1d9631c0a365c6e20.png`, // Animal                    (radical)
		 137: `${COMMON_URL}d/0/e/d0ed51f6cdb33fa9382ddedf78eb94701b0dcbc0.png`, // Blood                     (radical)
		 131: `${COMMON_URL}9/5/3/9533993eb368e62ac05ccb14e4a33445ebfffa58.png`, // Boil                      (radical)
		 127: `${COMMON_URL}d/5/0/d50dfe2d9e3c4b10f0fe9742e2a75496d18567ca.png`, // Box                       (radical)
		 267: `${COMMON_URL}1/5/c/15c4452d53483b6179531af24ca43d78c1e9f242.png`, // City                      (radical)
		 212: `${COMMON_URL}7/a/d/7add99f3c7d6ab1746fdf244ceea5c3173700af9.png`, // Death                     (radical)
		 139: `${COMMON_URL}d/2/d/d2d3ac2c22a777ca016aba84275be77198cfb566.png`, // Eat                       (radical)
		 143: `${COMMON_URL}b/b/d/bbd184058a300c3f29ef94c32f646e00c8fa3d98.png`, // Fortune                   (radical)
		 135: `${COMMON_URL}8/4/3/843bfbdae41a574684c8eda39fd69e50edecceea.png`, // Grain                     (radical)
		 134: `${COMMON_URL}b/9/1/b91dc794afdc2341feb2a8e15450a6e286addb95.png`, // Jet                       (radical)
		 128: `${COMMON_URL}2/a/b/2ab450ec304ea63113d6f31ae372ca66c027c624.png`, // Knife                     (radical)
		 142: `${COMMON_URL}f/8/2/f8236091403b95d92ba15b3f9b02626473c3cfca.png`, // Lack                      (radical)
		 129: `${COMMON_URL}b/3/6/b369048db7dacb324c8b0466ac75ef1292815cbb.png`, // Ladle                     (radical)
		  56: `${COMMON_URL}5/a/6/5a6dea2857b72f58b8aab029f87ee907ff2effab.png`, // Lion                      (radical)
		 138: `${COMMON_URL}c/c/c/cccf45c789729bf22bb113728c8782b17eb8c28e.png`, // Long                      (radical)
		 141: `${COMMON_URL}9/4/b/94b9e5ab4c93a8c9362252b1eeabcf5fe698716e.png`, // Mama                      (radical)
		 156: `${COMMON_URL}d/8/f/d8f6afdd7aac0e82723c274d25d54001270542c3.png`, // Neck                      (radical)
		 136: `${COMMON_URL}e/5/3/e53091641fdb67bec05979d5b23a55dab9694fe5.png`, // Sheep                     (radical)
		 174: `${COMMON_URL}b/d/c/bdc57146317b6d38e41ad46f44cf32f60916b1de.png`, // Tongue                    (radical)
		 132: `${COMMON_URL}4/0/a/40af75631715d4d6b5765c87f40fb56df9ddf7bd.png`, // Yakuza                    (radical)
		 610: `${COMMON_URL}2/3/e/23eaddf85ab6e08b26ddd48546e8a0764520704d.png`, // All                       (kanji)
		 636: `${COMMON_URL}9/a/a/9aab3dbdd342ee410bed450bc23a7ad826f24e65.png`, // Behind                    (kanji)
		 619: `${COMMON_URL}3/9/e/39e5c54c0445c09ee1c99c72a0f39c8bee7731f2.png`, // Blood                     (kanji)
		 609: `${COMMON_URL}d/4/7/d47b334915bf909f100cac17e12775aa2204664f.png`, // Both                      (kanji)
		 626: `${COMMON_URL}f/6/f/f6f6171d19bbe38997992e30bcc02ade8785f3f0.png`, // Bright                    (kanji)
		 620: `${COMMON_URL}b/2/0/b2008bfc2aef69fa97b975038aa55827bed5389d.png`, // Capital                   (kanji)
		 607: `${COMMON_URL}8/1/c/81c974948ee5659f24735361c9d81073103aa36d.png`, // Change                    (kanji)
		 621: `${COMMON_URL}e/7/c/e7ca8273616f56481e0332275c4d441b0ecfde56.png`, // Country                   (kanji)
		 642: `${COMMON_URL}3/0/5/3057719fdd90dbe4eb545c6910a733b0586a3548.png`, // Course                    (kanji)
		 617: `${COMMON_URL}5/5/0/550fdca24de704ab12a96e0f0b4027dad8088178.png`, // Death                     (kanji)
		 851: `${COMMON_URL}e/3/8/e38c4a00667b01d7e9ff8af8903b39e422ece81e.png`, // Death                     (kanji)
		 629: `${COMMON_URL}9/2/2/922c06a66d548f10869033f097d84786cb4ae24e.png`, // Drawing                   (kanji)
		 608: `${COMMON_URL}b/3/e/b3ea4733a1b7e1733bb6e8f0f75fddb570b274b0.png`, // Earth                     (kanji)
		 627: `${COMMON_URL}d/4/3/d433aa7d8e988b05dc2c8e8e54d151eecf1c6c89.png`, // East                      (kanji)
		 644: `${COMMON_URL}1/0/c/10cb3523c74b1e8cbec4389638ec42eab8f3eace.png`, // Eat                       (kanji)
		 630: `${COMMON_URL}e/d/2/ed21d76dd1d927002ab951d2738cb4f350bfcf76.png`, // Fix                       (kanji)
		 633: `${COMMON_URL}d/8/d/d8df83130e9fcf6fda2475bf3d3ee32306cbaa88.png`, // Front                     (kanji)
		 615: `${COMMON_URL}2/8/6/2867d8c382e6ad1bcb218fd2e08fdd00499d6057.png`, // Have                      (kanji)
		 923: `${COMMON_URL}a/0/3/a036910d538a4f684fb0df0f285bd8e054c7aab7.png`, // I                         (kanji)
		 631: `${COMMON_URL}8/7/f/87f5ab614b377d64ed062e28cc51a76965ed9368.png`, // Know                      (kanji)
		 639: `${COMMON_URL}d/0/4/d041ef10cd0ac44d8d42be4b7b3ae48827b70318.png`, // Lively                    (kanji)
		 632: `${COMMON_URL}5/8/3/583e81995ec8bbf073613d11e2036dea77df8c06.png`, // Long                      (kanji)
		 614: `${COMMON_URL}c/c/4/cc4d32143112789b97de0656368f398707a46982.png`, // Music                     (kanji)
		 645: `${COMMON_URL}d/5/7/d57b942d0f1ca40d8c0e2a3caf8fbb9099ff7e4f.png`, // Neck                      (kanji)
		 616: `${COMMON_URL}1/c/5/1c524800b93cefc92cec03555cc4cc5136895f93.png`, // Next                      (kanji)
		 622: `${COMMON_URL}0/c/d/0cdb04e91fc8d8fcd636791d0a6892804c47eac4.png`, // Night                     (kanji)
		 624: `${COMMON_URL}1/a/6/1a63584ab78e0eb7e558565c69c7639fe9f349f0.png`, // Older Sister              (kanji)
		 641: `${COMMON_URL}d/e/e/dee12735e20d702fb79087a94944fd02833e3e90.png`, // Point                     (kanji)
		 612: `${COMMON_URL}b/b/2/bb2f89b7af7e6ed035aab7aa2e331713b0567447.png`, // Relax                     (kanji)
		 635: `${COMMON_URL}8/9/5/895b9c6104ea69d72cf925c8b232cfe835118978.png`, // Room                      (kanji)
		 640: `${COMMON_URL}e/e/8/ee8396fcfb50527db91590d35f0ebf613c6c76c3.png`, // Sea                       (kanji)
		 618: `${COMMON_URL}a/6/5/a6552c92d76b3cd7da9cab80304aaf420c1fbabb.png`, // Sheep                     (kanji)
		 625: `${COMMON_URL}a/4/b/a4bf0a4f108b6f60ad76c21bf1619b50525b1c13.png`, // Shop                      (kanji)
		 634: `${COMMON_URL}f/f/b/ffbedee5d48d9cd742be704b31a159a14e8882e1.png`, // South                     (kanji)
		 638: `${COMMON_URL}8/f/5/8f51ebd036e8d11688142a0960d06d9977f6959e.png`, // Star                      (kanji)
		 613: `${COMMON_URL}2/6/b/26ba01c06da81b94f5986d5c39848831cd01e623.png`, // State                     (kanji)
		 643: `${COMMON_URL}7/b/a/7bac6bcf4229fc2d8832a6fa5d524dfab0661971.png`, // Tea                       (kanji)
		 637: `${COMMON_URL}1/5/2/152de734ff43a029d7d9ea4dea1a310208987f63.png`, // Think                     (kanji)
		 628: `${COMMON_URL}a/f/d/afd72bd34b9ad668f558d9b3a4469194af2a2d76.png`, // Walk                      (kanji)
		 611: `${COMMON_URL}8/e/6/8e665282a796fcbf11bf350bd16b675058dc1083.png`, // Yonder                    (kanji)
		 623: `${COMMON_URL}1/2/f/12f3c6d875f5d13fab435ba30a8624902402653c.png`, // Younger Sister            (kanji)
		 151: `${COMMON_URL}d/2/f/d2ff162aec63602ff6a578e3eb12655f527e0707.png`, // Bird                      (radical)
		 153: `${COMMON_URL}4/d/2/4d28850e5469e96b59ce3cb8e6d64a3279ba436e.png`, // Black                     (radical)
		 149: `${COMMON_URL}2/9/9/299f624a86e33d9ea7040410b167b65140363ce7.png`, // Boat                      (radical)
		 169: `${COMMON_URL}f/a/8/fa8c37b246f1834163933b11e0bdfad820822b92.png`, // Circumference             (radical)
		 147: `${COMMON_URL}6/c/0/6c01bdc1c473f1ae720b7e98ad09056dae3b39b0.png`, // Clan                      (radical)
		 150: `${COMMON_URL}c/c/7/cc71f026d554103d3c6911d72191420d0516c8ff.png`, // Fish                      (radical)
		 214: `${COMMON_URL}6/a/3/6a3d54405d2c0121c98875c2436551e993e8eb5a.png`, // Gate                      (radical)
		 146: `${COMMON_URL}6/5/7/657ce93ac983a88cd82ad620b6904ffd43b3cd54.png`, // Husband                   (radical)
		 228: `${COMMON_URL}5/6/f/56f1447d5b0fcfddb41408b2bd587c648302866b.png`, // Oneself                   (radical)
		 233: `${COMMON_URL}2/4/5/245d79798cbdac96ade42438e6334ab1d55a75b5.png`, // Pig                       (radical)
		 148: `${COMMON_URL}8/4/5/8452bfe455afb359dbf80007558d339a73342494.png`, // Spear                     (radical)
		 145: `${COMMON_URL}8/2/5/82517a1b9d1435004d98a7514b74f1683b162359.png`, // Stamp                     (radical)
		 177: `${COMMON_URL}d/8/f/d8f93edd7d2d15151d08a3e6ea5db460e4344069.png`, // Table                     (radical)
		 418: `${COMMON_URL}9/6/b/96b712b415736390a078569eafda2de53162b7fb.png`, // Teacher                   (radical)
		 192: `${COMMON_URL}7/4/c/74c28dd1911587eba74ae308b0d4db6017a380be.png`, // Temple                    (radical)
		 419: `${COMMON_URL}b/0/2/b020ed1f069c1ec44e0c734545451b4a1287520f.png`, // Top Hat                   (radical)
		 173: `${COMMON_URL}5/3/0/530140fe06378963eb69a604cc9bae4303aa96dc.png`, // Wing                      (radical)
		 152: `${COMMON_URL}1/a/1/1a1423dc8f9d23e2beabef34434e003079db0c94.png`, // Yellow                    (radical)
		 651: `${COMMON_URL}0/4/e/04e146db4adc37c26d523bdc53bde74adcf7ae3c.png`, // Area                      (kanji)
		 652: `${COMMON_URL}9/c/0/9c015f81b9468801965d8cce0f5e792e247bdbef.png`, // Attach                    (kanji)
		 649: `${COMMON_URL}b/3/f/b3fdf34ebf6b79d80b557a53deddae90dce88400.png`, // Bill                      (kanji)
		 675: `${COMMON_URL}2/3/d/23db86f84f78980534197ca94646037b307565c9.png`, // Bird                      (kanji)
		 677: `${COMMON_URL}8/3/8/8383da750cae1d61122c7b3bef53f532f88c7110.png`, // Black                     (kanji)
		 671: `${COMMON_URL}1/3/9/139ca2f504ef6895ea8ec853dc8a5de3b8c3c519.png`, // Boat                      (kanji)
		 655: `${COMMON_URL}8/9/2/892343dd332a8c9ff345ef4fc27aae70b853ed3c.png`, // Certain                   (kanji)
		 657: `${COMMON_URL}1/7/4/1748be0f83a2105d6f93896efdf9d4fdb652cfb0.png`, // End                       (kanji)
		 647: `${COMMON_URL}5/6/9/5696bcf7b1c1f350308e5156eb8a3a31c85d0564.png`, // Family Name               (kanji)
		 654: `${COMMON_URL}5/a/c/5aca32a7f20ab329cce5913ec65f516d3eaf56c5.png`, // Fault                     (kanji)
		 674: `${COMMON_URL}d/4/1/d41e8fe0c10ce705cc548c2907fe0bed4b1383b9.png`, // Fish                      (kanji)
		 653: `${COMMON_URL}6/4/4/64449f2e659ec12156785eee51fabb7d88964869.png`, // From                      (kanji)
		 670: `${COMMON_URL}2/5/a/25a16827395c1eb35e92020a76243de63bca34c7.png`, // Group                     (kanji)
		 660: `${COMMON_URL}0/7/0/070c101962cbafe487f808c869caf7bdfd5a6081.png`, // House                     (kanji)
		 646: `${COMMON_URL}4/0/c/40ca703ecdc0e669fbd62cdb7c9c9c254cecf198.png`, // Lack                      (kanji)
		 656: `${COMMON_URL}3/b/5/3b5fd1a9778fc74684152827533d29d6f57f66c7.png`, // Not Yet                   (kanji)
		 663: `${COMMON_URL}6/d/1/6d143d1799077e864a38ec13d51d8a774fcf35f7.png`, // Paper                     (kanji)
		 665: `${COMMON_URL}8/5/c/85cfb969235a5b724dc6e2cc2164b72c683a825c.png`, // Pass Through              (kanji)
		 650: `${COMMON_URL}4/2/c/42c7872b705c4b139e52b3821f3ffcdc15374799.png`, // Peoples                   (kanji)
		 648: `${COMMON_URL}8/9/6/896cae9cdc07daaa9f5c5710f0ff16aaba25cc8e.png`, // Reason                    (kanji)
		 669: `${COMMON_URL}d/b/8/db8b12b68a9a0198b232ecafb2acf2ba7ae85dc6.png`, // Reason                    (kanji)
		 658: `${COMMON_URL}a/9/f/a9f7f56691727e8956ef63957cfbbda373717531.png`, // School                    (kanji)
		 673: `${COMMON_URL}a/f/2/af289284d5126c07e2ffc0cfee5d3defc643346f.png`, // Snow                      (kanji)
		 667: `${COMMON_URL}4/3/a/43add15a9470caea868aca5822ee33ee99b56a4f.png`, // Strong                    (kanji)
		 659: `${COMMON_URL}f/9/a/f9adb5d26c316b8b2234e71e40f76384ec8c1a95.png`, // Summer                    (kanji)
		 666: `${COMMON_URL}1/5/a/15a76fde9a34ecf088f831f3f4c3ba42b20bd5ca.png`, // Tall                      (kanji)
		 668: `${COMMON_URL}5/7/8/5781b8cb4d30bd51c126fe246b159819a659773a.png`, // Teach                     (kanji)
		 662: `${COMMON_URL}6/5/4/654951bc3e7aeae83be5c93dc190cb2be629521e.png`, // Time                      (kanji)
		 661: `${COMMON_URL}a/0/f/a0f91683f17a195fce4d43b33a6445f66f5b49ba.png`, // Weak                      (kanji)
		 672: `${COMMON_URL}d/3/d/d3dff03b3cad6180627201eec3fdc30d7c26544e.png`, // Week                      (kanji)
		 853: `${COMMON_URL}d/6/d/d6d299a7e287698cb952c7c5276b6f90364fb1ea.png`, // Wind                      (kanji)
		 664: `${COMMON_URL}e/d/5/ed5a2e278a930df113921e63eb79ec880fd0d7ba.png`, // Write Down                (kanji)
		 676: `${COMMON_URL}6/8/0/680784ed65f194d8e5dad7a835c6970e86c609d4.png`, // Yellow                    (kanji)
		 217: `${COMMON_URL}3/2/f/32f618182e6c782b24f73d77150b3ed55483b600.png`, // Cage                      (radical)
		8780: `${COMMON_URL}4/8/e/48ef048c6a2294f776afee13c8eec5c4617437b1.png`, // Cape                      (radical)
		 159: `${COMMON_URL}2/d/7/2d735e38bc021f6035611cd95918051cbb5ae7d8.png`, // Cloud                     (radical)
		 161: `${COMMON_URL}1/f/6/1f64bee461c95e15d11e6c10ebd7b548278f8933.png`, // Compare                   (radical)
		 172: `${COMMON_URL}7/9/4/7949e906cacbe69c19b4b231f736ad8dc9c21910.png`, // Easy                      (radical)
		 170: `${COMMON_URL}2/0/c/20cc313b1028f4b98c5876163568d54eb7938178.png`, // Hole                      (radical)
		 157: `${COMMON_URL}1/7/6/1761bc6aebe7a88462e7fb22bd2d5de834f57ddf.png`, // Hook                      (radical)
		 165: `${COMMON_URL}c/e/e/cee0840be35d4326371537f8d76f0869fbb87afd.png`, // Horse                     (radical)
		 163: `${COMMON_URL}a/c/d/acd821f05831c339a9437f4f4e2a9d6204a07ab1.png`, // Net                       (radical)
		 164: `${COMMON_URL}d/2/7/d278d9a121e7d0098ee77fc1d721caa40cab580e.png`, // Sickle                    (radical)
		 158: `${COMMON_URL}8/c/1/8c1945903cf0d4babd8fd043982f409bd10db873.png`, // Snake                     (radical)
		 216: `${COMMON_URL}b/e/f/bef6748587481a0b91c5a521457e4fbedeea102b.png`, // Suit                      (radical)
		 160: `${COMMON_URL}6/6/5/66584fd0f3d1271b929251a047622a4959cfd08d.png`, // Weapon                    (radical)
// level 8 kanji placeholder
		 218: `${COMMON_URL}2/d/1/2d1e9f2ac6d0f399d97c7238c1ab20f85d5bf9f7.png`, // Anti                      (radical)
		 220: `${COMMON_URL}8/4/f/84f75d909d1c98449107bb1f4bf5b555f5256a63.png`, // Brush                     (radical)
		 176: `${COMMON_URL}0/7/3/073c654d244f29b6f21a4df9cec63edbde95ed76.png`, // Building                  (radical)
		8772: `${COMMON_URL}8/1/2/81271c0cb2b8f5064f65d1761e4258322ee1a6b0.png`, // Cleat                     (radical)
		 175: `${COMMON_URL}8/3/0/8300ee7ea6f656bddd530d1e5a7852f3fe846091.png`, // Clown                     (radical)
		 420: `${COMMON_URL}a/0/8/a081299a8ee61dca9798d2452038257e2caf5aa6.png`, // Coat Rack                 (radical)
		 229: `${COMMON_URL}d/c/f/dcf917a26ed439c17ade41f41c8da80d2a26882f.png`, // Correct                   (radical)
		8820: `${COMMON_URL}3/a/7/3a7ff7e4c989b8d0c67d46aac190bb77e34a0a12.png`, // Eternity                  (radical)
		8819: `${COMMON_URL}b/5/0/b50930861d14df00d4b1e8d1db9fbab8219e7823.png`, // Gladiator                 (radical)
		 188: `${COMMON_URL}0/1/a/01a9537ed34c28b20c73f870a5f0ba5898fca0fc.png`, // Heavy                     (radical)
		 424: `${COMMON_URL}9/f/6/9f6daf8bfc88dabd683f02da5ae73f0770367704.png`, // Helicopter                (radical)
		 167: `${COMMON_URL}9/9/5/9954ae1c579f54085bd2f75ae7f75eff059427cc.png`, // History                   (radical)
		 166: `${COMMON_URL}e/1/a/e1a7f167b44eb29d2073e78809d227451347bac5.png`, // Jammed In                 (radical)
		 417: `${COMMON_URL}7/3/9/739c5ff5277c25ae8fea515a5ebe32ab73e3eb4e.png`, // Machine                   (radical)
		8773: `${COMMON_URL}7/3/a/73a3fe34b332367a1af46a09fad3a728424e5e0e.png`, // Pope                      (radical)
		 178: `${COMMON_URL}6/a/8/6a81ddd94dbae8638e936af884c5269096151cde.png`, // Spicy                     (radical)
		8779: `${COMMON_URL}d/9/f/d9fcbba5898a716fde26e49eb9956a05426ee0c4.png`, // Spring                    (radical)
		8785: `${COMMON_URL}6/b/b/6bb46c240deeba03c73f3e13829371a1b1c1c448.png`, // Squid                     (radical)
		 168: `${COMMON_URL}a/3/6/a36db58f3569766400e43b82382bfb22419f291d.png`, // Tent                      (radical)
		8787: `${COMMON_URL}9/2/f/92f928ab68607a1082f2c0e6291f8a1ae1e9cec3.png`, // Yurt                      (radical)
// level 9 kanji placeholder
		 182: `${COMMON_URL}e/e/a/eeaa5a7e43aa336283f05aba426eb74d45aad231.png`, // Alcohol                   (radical)
		 181: `${COMMON_URL}1/8/2/18234a6303223119ee8bb3e885365ad7d5541590.png`, // Beans                     (radical)
		 219: `${COMMON_URL}d/d/e/ddea2b3fc1e72575b85b01c780d4b19e858e8774.png`, // Bundle                    (radical)
		8774: `${COMMON_URL}2/d/a/2dab43c216ccee57470a860dffc2241c46921185.png`, // Chinese                   (radical)
		 186: `${COMMON_URL}9/a/4/9a42097a9828a9df43c917dd91a69fe3d9e8524e.png`, // Dynamite                  (radical)
		 275: `${COMMON_URL}5/2/6/526c304dec9bb28e328e32e28525df0345750c5a.png`, // Fault                     (radical)
		 184: `${COMMON_URL}c/4/7/c478d4c2a52d890c7dfab63dcdac5adbf74cbdf0.png`, // Geoduck (Head)            (radical)
		 180: `${COMMON_URL}3/d/9/3d9df120e92a14d43fe515e8d4ed9e6a4fe012b7.png`, // Kiss                      (radical)
		 183: `${COMMON_URL}f/5/c/f5c3d110b37bbb7edd343218126d71a99c9ed5fe.png`, // Landslide                 (radical)
		 185: `${COMMON_URL}9/1/4/914b66c2b145cb1d08b645c9ee80f8fb1023dc98.png`, // Music                     (radical)
		 439: `${COMMON_URL}6/a/5/6a5bf551d2669cad828d27c42308888d7d652510.png`, // Sell                      (radical)
		 187: `${COMMON_URL}3/e/7/3e75a5045502607b8c5dbc5a08245cf1e938979b.png`, // Sick                      (radical)
		 200: `${COMMON_URL}1/7/9/17988fb04f7d4bc43a072be4bbc52d635ea222dc.png`, // Stairs                    (radical)
		 179: `${COMMON_URL}1/3/1/1315e5857ace7fbabc95768dc524a4be47df7683.png`, // Tombstone                 (radical)
		 240: `${COMMON_URL}c/7/d/c7d387bdbc6142d8c7bcd8059bb6c76e32812364.png`, // Turkey                    (radical)
	};

	init();
})();
