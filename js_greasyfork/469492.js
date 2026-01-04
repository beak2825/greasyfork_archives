// ==UserScript==
// @name         Kbin Easy Emoticon
// @namespace    http://tampermonkey.net/
// @version      0.7.8
// @description  easy way to add emoticons to your text with / commands
// @author       minnieo
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @match        https://karab.in/*
// @match        https://www.kbin.cafe/*
// @match        https://karab.in/*
// @match        https://readit.buzz/*
// @match        https://forum.fail/*
// @match        https://fedi196.gay/*
// @match        https://feddit.online/*
// @match        https://kbin.run/*
// @match        https://nadajnik.org/*
// @match        https://kbin.cafe/*
// @match        https://kbin.lol/*
// @match        https://nerdbin.social/*
// @match        https://kbin.lgbt/*
// @match        https://kbin.place/*
// @match        https://kopnij.in/*
// @match        https://kbin.sh/*
// @match        https://kayb.ee/*
// @match        https://wiku.hu/*
// @match        https://kbin.chat/*
// @match        https://fediverse.boo/*
// @match        https://tuna.cat/*
// @match        https://kbin.dk/*
// @match        https://kbin.projectsegau.lt/*
// @match        https://bin.pol.social/*
// @match        https://kbin.fedi.cr/*
// @match        https://baguette.pub/*
// @match        https://kbin.tech/*
// @match        https://teacup.social/*
// @match        https://thebrainbin.org/*
// @match        https://fr3diver.se/*
// @match        https://kbin.rocks/*
// @match        https://remy.city/*
// @match        https://community.yshi.org/*
// @match        https://kbin.buzz/*
// @match        https://kilioa.org/*
// @match        https://kbin.melroy.org/*
// @match        https://gehimeimer.de/*
// @match        https://champserver.net/*
// @match        https://k.fe.derate.me/*
// @match        https://the.coolest.zone/*
// @match        https://streetbikes.club/*
// @match        https://kbin.korgen.xyz/*
// @match        https://kbin.donar.dev/*
// @match        https://nolani.academy/*
// @match        https://kbin.dentora.social/*
// @match        https://kbin.cocopoops.com/*
// @match        https://thekittysays.icu/*
// @match        https://dev-kbin.korako.me/*
// @match        https://lab2.kbin.pub/*
// @match        https://lab3.kbin.pub/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/2/24/Lenny_face.png
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/469492/Kbin%20Easy%20Emoticon.user.js
// @updateURL https://update.greasyfork.org/scripts/469492/Kbin%20Easy%20Emoticon.meta.js
// ==/UserScript==

// thanks for using!! ❤︎
// thanks orito for the match links lol


(function() {
	'use strict';


	let eventListener;
	const emoticons = {
		'/shrug': '¯\\\\_(ツ)\\_/¯',
		'/lenny': '( ͡° ͜ʖ ͡°)',
		'/lenshrug': '¯\\_( ͡° ͜ʖ ͡°)_/¯',
		'/flipoff': '( ͡° ͜ʖ ͡°)╭∩╮',
		'/lenwink': '( ͡~ ͜ʖ ͡°)',
		'/welp': 'ツ',
		'/lensexy': '(͠≖ ͜ʖ͠≖)',
		'/tableflip': '(╯°□°)╯︵ ┻━┻',
		'/tableback': '┬─┬ノ( º _ ºノ)',
		'/bear': 'ʕ •ᴥ•ʔ',
		'/1bear': 'ʕっ• ᴥ • ʔっ',
		'/3hearteyes': '(♡ヮ♡)',
		'/happy': '╰(´꒳`)╯',
		'/rawr': '૮ ˙Ⱉ˙ ა',
		'/blush': '( ⸝⸝´꒳`⸝⸝)',
		'/1blush': '(o/////o " )',
		'/2blush': '⁄(⁄ ⁄•⁄-⁄•⁄ ⁄)⁄',
		'/1happy': '( ˶ˆ꒳ˆ˵ )',
		'/3blush': '(⸝⸝⸝• ω •⸝⸝⸝) ♡',
		'/smirk': '(   ͡º ꒳ ͡º)',
		'/givelove': '(˘︶˘).｡.:*♡',
		'/kiss': '( ˘ ³˘)♥',
		'/frown': '(  •̀ - •́  )',
		'/wink': '(˵ •̀ ᴗ - ˵ ) ✧',
		'/awesome': '৻(  •̀ ᗜ •́  ৻)',
		'/tough': 'ᕙ( •̀ ᗜ •́ )ᕗ',
		'/pleased': '(ㅅ´ ˘ `)',
		'/cry': '(╥﹏╥)',
		'/bummed': '( • ᴖ • ｡ )',
		'/wave': '◝(ᵔᵕᵔ)◜',
		'/decor': '♡⟡˙⋆',
		'/2decor': ' ⋆˙⟡♡',
		'/heart': '❤︎',
		'/1heart': '♡',
		'/star': '★',
		'/flower': '✿',
		'/concern': '(｡•́︿•̀｡)',
		'/4blush': '(⸝⸝ᵕᴗᵕ⸝⸝)',
		'/3happy': '(ﾉ^ヮ^)ﾉ',
		'/4happy': 'ᐠ( ᐛ )ᐟ',
		'/unhappy': '(¬_¬")',
		'/comfort': '( ´･･)ﾉ(._.`)',
		'/look': 'ಠ_ಠ',
		'/5happy': 'ᕕ( ᐛ )ᕗ',
		'/depress': '(◞‸◟）',
		'/shy': '( っ- ‸ - c)',
		'/bash': '(/▽＼)',
		'/lenblush': '( ͡°⁄ ⁄ ͜⁄ ⁄ʖ ⁄ ⁄ ͡°)',
		'/heh': '╮（￣▽￣）╭',
		'/energy': '༼ つ ◕_◕ ༽つ',
		'/1welp': '(งツ)ว',
		'/plead': '( •̯́ ^ •̯̀)',
		'/glad': '✧⁺⸜(●′▾‵●)⸝⁺✧',
		'/stoic': '( ་ ⍸ ་ )',
		'/cheer': '✽-(ˆ▽ˆ)/✽ ✽\\(ˆ▽ˆ)-✽',
		'/rush': '(•⌓• )⁼³₌₃',
		'/um': '(•-• )',
		'/evil': '(¬‿¬)',
		'/sparkles': '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
		'/blank': '(。。\\)',
		'/sus': '눈_눈',
		'/2heh': '(￣▽￣)"',
		'/smug': '( ￢ω￢)',
		'/3welp': '╮(╯-╰)╭',
		'/nunnun': '(๑╹ᆺ╹)',
		'/squint': '(≖_≖ )',
		'/donger': 'ヽ༼ຈل͜ຈ༽ﾉ',
		'/2donger': 'ヽ༼° ل͜ °༽ﾉ',
		'/3donger': 'ヽ༼⊙ل͜⊙༽ﾉ',
		'/4donger': 'ヽ༼≖ل͜≖༽ﾉ',
		'/5donger': 'ヽ༼ ・ ل͜ ・ ༽ﾉ',
		'/6donger': 'ヽ༼◉ل͜◉༽ﾉ',
		'/7donger': 'ヽ༼ ºلº ༽ﾉ',
		'/hmpf': '(︶^︶)',
		'/2awesome': '(◉ω◉)',
		'/2blank': '(・へ・)',
		'/3blank': '(　´_ゝ`)',
		'/4blank': "'ㅅ'",
		'/5blank': '(_ _;)',
		'/2um': '(⚆_⚆)',
		'/2cheer': '( ´▽\\`）o自自o（´▽` ）',
		'/patpat': '(　´▽`)ﾉ(´･ω･`)',
		'/dance': '♪┏(・o･)┛♪',
		'/why': 'щ(ﾟДﾟщ)',
		'/6blank': '( ﾟヮﾟ)...'
	};

	function displayCommandsModal() {
		const modalBackdrop = document.createElement('div');
		modalBackdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(2.5px);
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9998;
  `;

		document.body.appendChild(modalBackdrop);
		const modalContent = document.createElement('div');
		modalContent.style.cssText = `
       margin: 0;
        overflow: auto;
        position: fixed;
        height: 500px;
        width: 400px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #1A1A1B;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        z-index: 9999;
  `;

		const headingText = document.createElement('p');
		headingText.innerHTML = "COMMAND GUIDE"
		headingText.style.cssText = `
        font-weight: bold;
        text-align: center;
        font-size: 20px;

  `;

		const helpText = document.createElement('p');
		helpText.innerHTML = 'Use <b>/help</b> to open this command panel.'
		helpText.style.cssText = `
        font-size: 15px;
        text-align: center;
        margin: 0;
        margin-bottom: 20px;
  `;
		const commandList = document.createElement('ul');
		commandList.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 0;
        margin-bottom: 10px;
  `;

		const greasyLink = document.createElement('a');
		greasyLink.innerHTML = `<a href="https://greasyfork.org/en/scripts/469492-kbin-easy-emoticon" target="_blank">🔗 See the script on GreasyFork</a>`
		greasyLink.classList.add('gLink');
		greasyLink.style.cssText = `
       display: flex;
       justify-content: center;
       margin-top: 5px;
       margin-bottom: 10px;
  `;

    const creds = document.createElement('p');
    creds.innerHTML = `<a href="https://kbin.social/u/minnieo" target="_blank">by minnie</a>`
    creds.style.cssText = `
        opacity: 0.3;
        display: flex;
        justify-content: center;

    `;

		for (const [command, emoticon] of Object.entries(emoticons)) {
			const listItem = document.createElement('li');
			listItem.textContent = `${command}:   ${emoticon}`;
			listItem.style.cssText = `
          margin-bottom: 4px;

    `;

			commandList.appendChild(listItem);
		}


		modalContent.append(headingText, helpText, commandList, greasyLink, creds);
		document.body.appendChild(modalContent);


		const handleClickOutside = (event) => {
			if (!modalContent.contains(event.target)) {
				document.body.removeChild(modalContent);
				document.body.removeChild(modalBackdrop);
				document.removeEventListener('click', handleClickOutside);
			}
		};


		document.addEventListener('click', handleClickOutside);

	} // end of displayCommandsModal()

	function emoticonGen() {
		eventListener = (e) => {
			if (e.target.tagName === 'TEXTAREA') {
				emoticonMake(e.target);
				// handle the "/help" command
				if (e.target.value.includes('/help') || e.target.value.includes('/commands')) {
					displayCommandsModal();
					e.target.value = e.target.value.replace('/help', '');
				}
			}
		};
		document.addEventListener('input', eventListener);
	}

	function emoticonMake(param) {
		let text = param.value;
		for (const [command, emoticon] of Object.entries(emoticons)) {
			text = text.replace(new RegExp(command, 'g'), `${emoticon} `);
		}
		param.value = text;
	}
	emoticonGen();


})();